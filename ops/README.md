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

#### deploy new code

To depoy the latest version of main to the production node:

```bash
gcloud compute ssh bravo-testnet-vm-0 --zone us-central1-a
sudo su -
cd /data/lilypad
source .env

# Update code
git pull

# Deploy new contract
(cd src/js && npx hardhat deploy --network localgeth)

# Deploy new code
./stack stop
./stack start
exit
```

**You must now update the contract address in the latest.txt file which is distributed to users**

Now you need to update the `./latest.txt` file:

```python
git_hash|<7 character short git hash>
contract_address|<contract address>
mediator_addresses|<mediator addresses, comma separated>
```

git_hash you can get by:
```bash
git rev-parse --short HEAD
```

contrat_address you get by:

```bash
cat src/js/deployments/localgeth/Modicum.json | jq -r .address
```

mediator_addresses you get by:

```bash
cat .env | grep ADDRESS_MEDIATOR
```


### deploy client scripts

First we need to build and push images for both amd64 and arm64.

So - we need to do the following on BOTH x86 and ARM machines:

```bash
git pull
./stack reset
./stack build
./stack push-images
```

Now we need to get the version:

```bash
./stack version
```

Then add it to the `./lilypad` script:

```bash
export GIT_HASH=${GIT_HASH:="<insert-version-here>"}
```

Then commit and push.
