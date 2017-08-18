---
layout: post
title: Docker tips and tricks
date: 2017-08-01 09:11:29
---

Here are some of my notes about some tips & tricks which I took during the my learning process.

## To run and deploy a Docker app

2. Use `docker-machine ip default` to get the docker-machine's exposed IP address.
3. Before pushing an image, tag it using `docker tag my_image $DOCKER_ID_USER/my_image`.

## Troubleshooting

If you get this error in Docker Quickstart Console: 

> error during connect: Get http://%2F%2F.%2Fpipe%2Fdocker_engine/v1.30/containers/json: open //./pipe/docker_engine: The system cannot find the file specified. In the default daemon configuration on Windows, the docker client must be run elevated to connect. This error may also indicate that the docker daemon is not running.

6. `docker-machine regenerate-certs default`
7. `docker-machine env default`
8. `eval $("C:\ProgramData\chocolatey\lib\docker-machine\bin\docker-machine.exe" env default)`