### production initial node setup

We use the terraform scripts to run a single google cloud node:

```bash
gcloud auth application-default login
gcloud config set project bacalhau-production
cd ops/testnet
terraform init
terraform apply
gcloud compute instances list
gcloud compute ssh bravo-testnet-vm-0 --zone us-central1-a
# These commands are run on the node
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs jq
sudo su -
cd /data
git clone https://github.com/bacalhau-project/lilypad.git
cd lilypad
(cd src/js && npm install)
node src/js/scripts/create-new-accounts.js > .env
echo "export DATA_DIRECTORY=/data/geth" >> .env
source .env
./stack compile-contract
./stack geth
sleep 5
./stack fund-admin
./stack fund-faucet
./stack fund-services
./stack balances
(cd src/js && npx hardhat deploy --network localgeth)
./stack start
exit
```

### production deploy

To depoy the latest version of main:

```bash
gcloud compute ssh bravo-testnet-vm-0 --zone us-central1-a
sudo su -
cd /data/lilypad
source .env
./stack stop
git pull
./stack start
exit
```