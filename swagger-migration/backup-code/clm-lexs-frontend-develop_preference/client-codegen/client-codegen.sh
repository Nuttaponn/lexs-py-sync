# wget -O ./spec/configuration.json https://lexsdev.krungthai/ktb/rest/lexs/configuration/v3/api-docs --no-check-certificate
# wget -O ./spec/user.json https://lexsdev.krungthai/ktb/rest/lexs/user/v3/api-docs --no-check-certificate
# wget -O ./spec/master-data.json https://lexsdev.krungthai/ktb/rest/lexs/master-data/v3/api-docs --no-check-certificate
# wget -O ./spec/customer.json https://lexsdev.krungthai/ktb/rest/lexs/customer/v3/api-docs --no-check-certificate
# wget -O ./spec/litigation.json https://lexsdev.krungthai/ktb/rest/lexs/litigation/v3/api-docs --no-check-certificate
# wget -O ./spec/document.json https://lexsdev.krungthai/ktb/rest/lexs/document/v3/api-docs --no-check-certificate
# wget -O ./spec/financial.json https://lexsdev.krungthai/ktb/rest/lexs/financial/v3/api-docs --no-check-certificate
# wget -O ./spec/report.json https://lexsdev.krungthai/ktb/rest/lexs/report/v3/api-docs --no-check-certificate
# wget -O ./spec/notification.json https://lexsdev.krungthai/ktb/rest/lexs/notification/v3/api-docs --no-check-certificate
# wget -O ./spec/seizure.json https://lexsdev.krungthai/ktb/rest/lexs/seizure/v3/api-docs --no-check-certificate
# wget -O ./spec/withdraw-seizure.json https://lexsdev.krungthai/ktb/rest/lexs/withdraw-seizure/v3/api-docs --no-check-certificate
# wget -O ./spec/auction.json https://lexsdev.krungthai/ktb/rest/lexs/auction/v3/api-docs --no-check-certificate
# wget -O ./spec/auction.json https://lexsdev.krungthai/ktb/rest/lexs/asset-investigation/v3/api-docs --no-check-certificate
# wget -O ./spec/preference.json https://lexsdev.krungthai/ktb/rest/lexs/preference/v3/api-docs --no-check-certificate

rm spec/swagger.json

echo '{}' > ./spec/swagger.json
node tool/mergeJson.js ./spec/swagger.json ./spec/user.json
node tool/mergeJson.js ./spec/swagger.json ./spec/configuration.json
node tool/mergeJson.js ./spec/swagger.json ./spec/master-data.json
node tool/mergeJson.js ./spec/swagger.json ./spec/customer.json
node tool/mergeJson.js ./spec/swagger.json ./spec/litigation.json
node tool/mergeJson.js ./spec/swagger.json ./spec/document.json
node tool/mergeJson.js ./spec/swagger.json ./spec/financial.json
node tool/mergeJson.js ./spec/swagger.json ./spec/report.json
node tool/mergeJson.js ./spec/swagger.json ./spec/notification.json
node tool/mergeJson.js ./spec/swagger.json ./spec/seizure.json
node tool/mergeJson.js ./spec/swagger.json ./spec/withdraw-seizure.json
node tool/mergeJson.js ./spec/swagger.json ./spec/auction.json
node tool/mergeJson.js ./spec/swagger.json ./spec/asset-investigation.json
node tool/mergeJson.js ./spec/swagger.json ./spec/preference.json

#generate
source ./rest-codegen.sh

codegen swagger ../projects/lexs/lexs-client/src/
