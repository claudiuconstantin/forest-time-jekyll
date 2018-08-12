---
layout: post
title:  "Create audioposts for your blog"
date:   2018-08-12 10:23:16 +0200
categories: aws
audiopost: true
---

**In this tutorial we are going to add Text-to-Speech conversion to our Jekyll blog using AWS Polly, AWS Gateway and AWS Lambda.**

By the end of the tutorial we will have a Play button in our posts by which we can ask Polly to read out loud our blog posts. I'd like to highlight that this tutorial was inspired by lecture created by an online course provider called [A Cloud Guru](https://acloud.guru) which I recommend wholeheartedly.

## Prerequisites

- A Jekyll blog hosted on GitHub Pages
- A free-tier AWS account

## The setup

We are going to convert the text of our posts into mp3 files which we are going to store in a S3 bucket. To create the mp3 files we are going to use an AWS Lambda function that will trigger AWS Polly.

To access our public Lambda function we will create an AWS API Gateway. We'll set API Gateway's CORS policy to only accept requests from our custom domain and it will kick-off our Lambda function. We will also set up AWS CloudFront to serve our audio files over HTTPS.

{% include image.html file="polly_and_jekyll.png" alt="The structure of our cloud" %}

## Building the cloud

We are going to build our cloud in two parts, starting with the bottom part of our figure above, which is responsible for the file distribution. Then we are going to continue with the top part which will handle the file conversion.

### File storage and distribution

Let's start by setting up our CDN. First off, let's create our S3 bucket. When creating the bucket, do not grant public access to its content. Next, let's create our CloudFront web distribution. For the Origin Domain Name select the previously created S3 bucket. Make sure **Restrict Bucket Access** is checked. If you already have a Origin Access Identity, you can reuse that, otherwise just create a new one. If you don't want to update the bucket policy manually, make sure that **Yes, Update Bucket Policy** is checked under **Grant Read Permissions on Bucket**.

Another thing we want to set is to serve our files over HTTPS so don't forget to set the Viewer Protocol Policy to **Redirect HTTP to HTTPS**. If everything seems good, hit **Create Distribution**. If everything went well, we can confirm that our setup works by uploading a file to our bucket and trying to access it using the CloudFront URL.

### File conversion

We are ready to build the top part of the diagram. Let's start by creating our Lambda function. We are going to use the following Python script.

```python
import boto3
import os
from contextlib import closing
from boto3.dynamodb.conditions import Key, Attr

def lambda_handler(event, context):
        
    audiopostid = event["audiopostid"]
    text = event["text"]
    voice = event["voice"] 
    
    try:
        os.remove(os.path.join("/tmp/", audiopostid + ".mp3"))
    except OSError:
        pass
    
    rest = text
    
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

    polly = boto3.client('polly')
    for textBlock in textBlocks: 
        response = polly.synthesize_speech(
            OutputFormat='mp3',
            Text = textBlock,
            VoiceId = voice
        )
        
        if "AudioStream" in response:
            with closing(response["AudioStream"]) as stream:
                output = os.path.join("/tmp/", audiopostid)
                with open(output, "a") as file:
                    file.write(stream.read())


    s3 = boto3.client('s3')
    s3.upload_file('/tmp/' + audiopostid, 
      os.environ['BUCKET_NAME'], 
      audiopostid + ".mp3")
    s3.put_object_acl(ACL='public-read', 
      Bucket=os.environ['BUCKET_NAME'], 
      Key= audiopostid + ".mp3")

    location = s3.get_bucket_location(Bucket=os.environ['BUCKET_NAME'])
    region = location['LocationConstraint']
    
    if region is None:
        url_begining = "https://s3.amazonaws.com/"
    else:
        url_begining = "https://s3-" + str(region) + ".amazonaws.com/" \
    
    url = url_begining \
            + str(os.environ['BUCKET_NAME']) \
            + "/" \
            + str(audiopostid) \
            + ".mp3"
        
    return
```

There is one thing I'd like to highlight in the script. When using a Lambda, it creates something called an [Execution Context](https://docs.aws.amazon.com/lambda/latest/dg/running-lambda-code.html) that might be reused when the function is invoked again. This Execution Context provides 500MB disk space where data can be stored and retrieved from.

Because we are opening the files in append mode, we have to make sure that there are no previously saved files present when we initiate the conversion. That's why we try to delete the files in the beginning of the script.

As you can see this script utilizes an environment variable called `BUCKET_NAME`. Don't forget to set this variable to your bucket name under the text editor. Because this function will wait for Polly to convert the provided text into audio, it might take some time to execute the whole function. To make sure that our request will not time out, go to the **Basic settings** of the function and set the **Timeout** to 5 minutes.

### Creating our API Gateway

The very last step in the cloud setup is to create an endpoint for our Lambda function in API Gateway. Let's navigate to API Gateway service and hit the **Create API** button. Once created, let's created a new Resource and then a new Method. When creating the new method, set the **Integration type** to a **Lambda function**, and select your newly created Lambda function below.

We can also set the CORS settings to only accept requests coming from our blog domain. To do so, select your resource, click **Actions** and select **Enable CORS**, where we can set the **Access-Control-Allow-Origin** to our blog domain.

## Building the client

Now it is about time to create our client. Let's navigate to our Jekyll template for your posts which is called `post.html` by default. Since we might have very long posts for which we don't want to have audioposts, we will use a page property defined in the YAML header to decide whether we want to have audio for a given post or not. If the `audiopost` YAML header is set, we will create an audio player element that will automatically try to load the mp3 file from our CDN distribution.

```html
{% raw %}{% if page.audiopost %}
    <div class="c-post-header__player">
        <audio controls id="player">
            <source id="audiopost" src="https://YOUR-CLOUDFRONT-DISTRIBUTION.cloudfront.net{{ page.url }}.mp3" type='audio/mpeg'>
        </audio>
    </div>
{% endif %}{% endraw %}
```

Now we have to handle the case in which the audio file cannot be found. In this case, we would like to kick-off our Lambda function to start the conversion. Once the request succeeded, we will try to reload the file.

```html
{% raw %}{% if page.audiopost %}
    <script>
        $( document ).ready(function() {
            $("#audiopost").on("error", function (e) {
                createAudiopost();
            });
        });

        function createAudiopost(){
            var inputData = getInputData();
            $.ajax({
                url: "https://YOUR-API.execute-api.YOUR-REGION.amazonaws.com/YOUR-STAGE/YOUR-RESOURCE",
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
{% endif %}{% endraw %}
```

Don't forget to add the corresponding YAML header to the posts for which you wish to have audioposts.

```yaml
audiopost: true
```

Keep in mind, that if you have set the CORS settings in your API Gateway, you won't be able to test this set up locally, you'll have to push your new posts into production and initiate the conversion from there.

Moreover it is a good idea to initiate the file conversion by yourself to avoid race conditions where multiple users kick-off the same Lambda function.