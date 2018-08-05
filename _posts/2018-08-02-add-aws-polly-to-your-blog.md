---
layout: post
title:  "Create audioposts for your blog"
date:   2018-08-02 10:23:16 +0200
categories: aws
published: false
---

**In this tutorial we are going to add Text-to-Speach conversion to our Jekyll blog using AWS Polly, AWS Gateway and AWS Lambda.**

By the end of the tutorial you will have a Play button in your posts by which we can ask Polly to read out loud our blog posts.

## Prerequisites

- A Jekyll blog hosted on GitHub Pages
- A free-tier AWS account

## The setup

We are going to store the mp3 files in an S3 bucket. To create the mp3 files we are going to use an AWS Lambda function that will trigger AWS Polly and then save the generated files into our bucket.

To access our public Lambda function we will create an AWS API Gateway. API Gateway will accept requests coming from a our domain and kick-off our Lambda function. We will also set up AWS CloudFront to serve our audio files over HTTPS.

## Let's build


### Let's build the client

```html
{{ if page.audiopost %} }}
<div class="c-post-header__player">
    <audio controls id="player">
        {% assign url = page.url %} 
        {% if url == '/star-wars-card-game' %}
            {% assign url = '/star-wars-card-game-little-test-brian' %}
        {% endif %}
        <source id="audiopost" src="https://d3e6cwu83ridgj.cloudfront.net{{ url }}.mp3" type='audio/mpeg'>
        }
    </audio>
</div>
{% endif %}
```

```html
<script>
    $( document ).ready(function() {
        $("#audiopost").on("error", function (e) {
            createAudiopost();
        });
    });

    function createAudiopost(){
        var inputData = getInputData();
        console.log(inputData.text);
        $.ajax({
            url: "https://6ra6sowv65.execute-api.eu-central-1.amazonaws.com/Production/audioposts",
            type: 'POST',
            data:  JSON.stringify(inputData)  ,
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                document.getElementById("player").load();
            },
            error: function () {
                $(".c-post-header__player").text("Audiopost was not found and creation request denied.");
            }
        });
    }

    function getInputData() {
        
        var audiopostid = "{{page.url}}";
        audiopostid = audiopostid.replace("/", "");

        var text = $("#content").html();
        var s = $(text).find('pre').replaceWith("<span>Here is a code snippet.</span>").end().text();
        var inputData = {
            "audiopostid": audiopostid,
            "text": s,
            "voice" : "Brian"
        };

        return inputData;
    }
</script>
```

1. Create a bucket for mp3 files.
2. Create an IAM for Lambda, Create new policy
3. add Lambda policies using json

```json
{
   "Version": "2012-10-17",
   "Statement": [
       {
           "Effect": "Allow",
           "Action": [
                "polly:SynthesizeSpeech",
                "dynamodb:Query",
                "dynamodb:Scan",
                "dynamodb:PutItem",
                "dynamodb:UpdateItem",
                "sns:Publish",
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:GetBucketLocation",
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
           ],
           "Resource": [
               "*"
           ]
       }
   ]
}
```

4. Create Policy `myLambdaPollyPolicy`
5. Create the IAM Role `myLambdaPollyRole`
6. Let's go SNS
7. Create topic `new_posts`
8. Let's go to AWS Lambda, create function `ConvertToAudio` Python 2.7
9. Add `myLambdaPollyRole`

```python
import boto3
import os
from contextlib import closing
from boto3.dynamodb.conditions import Key, Attr

def lambda_handler(event, context):

    postId = event["Records"][0]["Sns"]["Message"]
    
    print "Text to Speech function. Post ID in DynamoDB: " + postId
    
    #Retrieving information about the post from DynamoDB table
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(os.environ['DB_TABLE_NAME'])
    postItem = table.query(
        KeyConditionExpression=Key('id').eq(postId)
    )
    

    text = postItem["Items"][0]["text"]
    voice = postItem["Items"][0]["voice"] 
    
    rest = text
    
    #Because single invocation of the polly synthesize_speech api can 
    # transform text with about 1,500 characters, we are dividing the 
    # post into blocks of approximately 1,000 characters.
    textBlocks = []
    while (len(rest) > 1100):
        begin = 0
        end = rest.find(".", 1000)

        if (end == -1):
            end = rest.find(" ", 1000)
            
        textBlock = rest[begin:end]
        rest = rest[end:]
        textBlocks.append(textBlock)
    textBlocks.append(rest)            

    #For each block, invoke Polly API, which will transform text into audio
    polly = boto3.client('polly')
    for textBlock in textBlocks: 
        response = polly.synthesize_speech(
            OutputFormat='mp3',
            Text = textBlock,
            VoiceId = voice
        )
        
        #Save the audio stream returned by Amazon Polly on Lambda's temp 
        # directory. If there are multiple text blocks, the audio stream
        # will be combined into a single file.
        if "AudioStream" in response:
            with closing(response["AudioStream"]) as stream:
                output = os.path.join("/tmp/", postId)
                with open(output, "a") as file:
                    file.write(stream.read())



    s3 = boto3.client('s3')
    s3.upload_file('/tmp/' + postId, 
      os.environ['BUCKET_NAME'], 
      postId + ".mp3")
    s3.put_object_acl(ACL='public-read', 
      Bucket=os.environ['BUCKET_NAME'], 
      Key= postId + ".mp3")

    location = s3.get_bucket_location(Bucket=os.environ['BUCKET_NAME'])
    region = location['LocationConstraint']
    
    if region is None:
        url_begining = "https://s3.amazonaws.com/"
    else:
        url_begining = "https://s3-" + str(region) + ".amazonaws.com/" \
    
    url = url_begining \
            + str(os.environ['BUCKET_NAME']) \
            + "/" \
            + str(postId) \
            + ".mp3"

    #Updating the item in DynamoDB
    response = table.update_item(
        Key={'id':postId},
          UpdateExpression=
            "SET #statusAtt = :statusValue, #urlAtt = :urlValue",                   
          ExpressionAttributeValues=
            {':statusValue': 'UPDATED', ':urlValue': url},
        ExpressionAttributeNames=
          {'#statusAtt': 'status', '#urlAtt': 'url'},
    )
        
    return
```


10. DB_TABLE_NAME `posts`
11. BUCKET_NAME `polly.gaboratorium.com`.
12. Somehow check if Lambda function is already running (so we cannot press the play button multiple times).
13. Add Description
14. 5 minutes timeout
15. Add Trigger, SNS, Configuration required, topic, new_posts topic, ADD, Save.

16. API Gateway - Create API -> CORS from our domain.
17. Create method: GET -> Lambda Function
18. Enable CORS
19. URL Query String Parameters
20. Get Integration test -> Body Mapping templates
21. When there are no templates defined -> application/json
22. Click on application/json > insert template
23. Click `/` Actions -> Deploy API, create new deployment
24. Copy Invoke URL

## Concurrency

Keep in mind that with this set up we can run into concurrency issues: it is possible to kick off Lambda several times. 