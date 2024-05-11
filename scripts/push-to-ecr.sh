#!/bin/bash
cd $(dirname "$0")
cd ../terraform

repo=$(terraform output -raw repository_url)
