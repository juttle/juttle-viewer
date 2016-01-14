#!/bin/bash

docker run -d -p 4444:4444 --name selenium-hub selenium/hub
docker run -d --link selenium-hub:hub --name selenium-node-chrome selenium/node-chrome
