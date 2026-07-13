
terraform {
  backend "azurerm" {
    resource_group_name  = "CredPayRG"
    storage_account_name = "credpaysas1"
    container_name       = "statefile"
    key                  = "credpay.terraform.tfstate"
  }
}
