#!/bin/bash
echo $(dirname "$0")

cd ../terraform

terraform plan -out aks.tfplan