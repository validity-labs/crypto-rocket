# Environment setup

We use a separate terraform configuration to create and maintain environments. This also includes creating the service account for the Gitlab CI and assigning the necessary permissions.
Doing this is necessary so that the service account used in the CI does not need cross-project permissions. Instead, the following commands must be executed manually by a GCP administrator account. It is required that the GCP user has the permission to create new projects and assign them to a billing account. Also, this user must have write permissions to the Google Cloud Storage bucket with the terraform state of the project.

If the project is newly created, the steps below [Initial setup](#initial-setup) must be executed first of all. Afterwards new environments can be created by following the instructions in the section [Creation of new environments](#creation-of-new-environments).

## Infrastructure provisioning

Requirements:

- Download the terraform backend encryption key from Bitwarden
- A gitlab access token

Instructions:

1. Initialize terraform:

   ```bash
   terraform init -backend-config="./tf-backend-encryption-key"
   ```

2. Select the terraform workspace of the environment you want to deploy the changes to:

   ```bash
   terraform workspace select <environment-name>
   ```

   You can list the available terraform workspaces with the following command:

   ```bash
   terraform workspace list
   ```

3. Check which changes are made when Terraform deploys the infrastructure:

   ```bash
   terraform plan -var-file="config/$(terraform workspace show).tfvars" -var-file="config/$(terraform workspace show)-secrets.tfvars"
   ```

4. Perform deployment of infrastructure changes:

   ```bash
   terraform apply -var-file="config/$(terraform workspace show).tfvars" -var-file="config/$(terraform workspace show)-secrets.tfvars"
   ```

## Creation of new environments

Requirements:

- Download the terraform backend encryption key from Bitwarden
- A gitlab access token

Instructions:

1. Initialize terraform

   ```bash
   terraform init -backend-config=tf-backend-encryption-key
   ```

2. Check if the corresponding terraform workspace for the environment already exists

   ```bash
   terraform workspace list
   ```

   If this is not the case, proceed to the next step.

3. Create a new terraform workspace for the new environment (e.g. test, staging, prod, ...)

   ```bash
   terraform workspace new <environment-name>
   ```

4. Create a `config/<environment>.tfvars` file for the environment that contains the required settings for the environment.

   ```bash
   vi config/$(terraform workspace show).tfvars
   ```

5. In the created file, all variables from the variables.tf file can now be assigned values for the corresponding environment. Make sure that the file does not contain any credentials!

   The content of the file could look like this afterwards: (TODO:)

   ```bash
   gitlab_project = "validitylabs/my/repo"
   reporting_engine_domain="api-<project-name>-<environment>.validity.io"
   ui_reporter_domain="<project-name>-<environment>.validity.io"
   ```

6. Create a `config/<environment>-secrets.tfvars` file for the environment that contains the required secrets for the environment (because they shouldn't be tracked in git).

   ```bash
   vi config/$(terraform workspace show)-secrets.tfvars
   ```

7. In the created file, all variables from the variables.tf file can now be assigned values for the corresponding environment. Make sure that the file does not contain any credentials!

   The content of the file could look like this afterwards: (TODO:)

   ```bash
   gitlab_project = "validitylabs/products/crypto-fraud"
   gcp_folder_id = <folder-id>
   gcp_billing_account = "<gcp-billing-account-id>"
   reporting_engine_domain="api-<project-name>-<environment>.validity.io"
   ui_reporter_domain="<project-name>-<environment>.validity.io"
   ```

8. Follow the steps in section [Infrastructure provisioning](#Infrastructure-provisioning)

9. Grant the service account for the CI access to the domain `validity.io` in [google webmaster tools](https://www.google.com/webmasters/verification/details?hl=de&domain=validity.io)

   Run the following command to get the email address of the gitlab ci service account: `terraform output --raw gcp_gitlab_ci_service_account_email`

10. Set Gitlab CI variables at gitlab.com: API_DOMAIN, GCP_PROJECT, GCP_SERVICE_ACCOUNT_KEY_JSON, TERRAFORM_BACKEND_GCS_BUCKET

11. Define Gitlab CI jobs in the `gitlab-ci.yml` file

## Initial setup

### Create terraform state bucket

In order to allow other people to be able to deploy infrastructure changes to projects using terraform, we need to store the terraform state in a central location.
For this we will create a Google Cloud Storage bucket in a general GCP project (for DAT AG it's called `dat-internal` and for Validity Labs `devops-252519`).

**Important: Each project should use a separate GCS bucket.**

1. Set the id of the gcp project in which the gcs bucket should be created:

   ```bash
   export GCP_PROJECT_ID=<gcp-project-id>
   ```

1. Set the name of the project:

   ```bash
   export PROJECT_NAME=<project-name>
   ```

1. Compose the bucket name including a random string which is used to make sure that the backup name is unique (command is probably only working on MacOS):

   ```bash
   export GCS_TERRAFORM_BUCKET_NAME="gs://$PROJECT_NAME-terraform-state-$(head -c 1024 /dev/urandom | base64 | tr -cd "[:lower:][:digit:]" | head -c 4)/"
   ```

1. Create the gcs bucket:

   ```bash
   gsutil mb -l EU -p $GCP_PROJECT_ID $GCS_TERRAFORM_BUCKET_NAME
   ```

1. Enable versioning:

   ```bash
   gsutil versioning set on $GCS_TERRAFORM_BUCKET_NAME
   ```

1. Open the main.tf file in the current directory and set the bucket name in the terraform configuration object.
   The object looks something like this and should be at the beginning of the file:

   ```bash
   ...

   terraform {
       # Configure gcs as the backend for the terraform state
       backend "gcs" {
           bucket = "<bucket-name>"
       }
   }

   ...
   ```

1. Create an customer supplied encryption key for the terraform state file inside the GCS bucket. For more instructions checkout: https://cloud.google.com/storage/docs/encryption/using-customer-supplied-keys

1. Create a file called `tf-backend-encryption-key` in the environment terraform module root directory and insert the following content (don't forget to replace `<replace-with-generated-encryption-key>` with the newly created key from the previous step):

   ```
   encryption_key="<replace-with-generated-encryption-key>"
   ```

### Create a resource folder in GCP for the projects

All GCP Project should be created in a resource folder for better organization. This folder must be created once initially.

1. Set organization id and project name

   ```bash
   # Validity Labs
   export GCP_ORGANIZATION_ID=960769728991

   # or

   # DAT AG
   export GCP_ORGANIZATION_ID=1066784281804
   ```

   ```bash
   export PROJECT_NAME=<project-name>
   ```

2. Get the project folder id in order to check if the folder already exists

   ```bash
   gcloud resource-manager folders list --organization=$GCP_ORGANIZATION_ID --format="get(ID)" --filter=$PROJECT_NAME
   ```

   The command should return something like this: `folders/[folder-id]`. If that's the case, then add the folder number (after the slash) to your clipboard and _continue with step 4_.

   If the command returns nothing, the folder doesn't exist. In this case _continue with step 3_.

3. Create a new folder

   ```bash
   gcloud resource-manager folders create --display-name=$PROJECT_NAME --organization=$GCP_ORGANIZATION_ID
   ```

   Get the id of the new folder:

   ```bash
   gcloud resource-manager folders list --organization=$GCP_ORGANIZATION_ID --format="get(ID)" --filter=$PROJECT_NAME
   ```

   The command should return something like this: `folders/[folder-id]`. Add the folder number after the slash to your clipboard.

4. Open the file `extra/terraform/environment/variables.tf` and paste the content from your clipboard as default value of the variable `gcp_folder_id`.

### Define which billing account should be used in main.tf

_TBD_

### Set project name in main.tf

gcp_project_name

### Create Gitlab access token

1. Open https://gitlab.com/-/profile/personal_access_tokens and create a new access token with the following permissions: api, read_api

2. Save the access token in your personal password manager
