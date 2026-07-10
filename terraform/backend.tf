
terraform {
  backend "azurerm" {
    resource_group_name  = "credstage1"
    storage_account_name = "credstage1sa"
    container_name       = "statefile"
    key                  = "credpay.terraform.tfstate"
  }
}
