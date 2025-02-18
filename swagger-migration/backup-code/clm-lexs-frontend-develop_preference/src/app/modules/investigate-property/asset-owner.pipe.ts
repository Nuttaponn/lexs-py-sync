import { Pipe, PipeTransform } from '@angular/core';
import { AssetInvestigationAssetOwners } from '@lexs/lexs-client';

@Pipe({
  name: 'assetOwner',
})
export class AssetOwnerPipe implements PipeTransform {
  transform(value: Array<AssetInvestigationAssetOwners>, ...args: unknown[]): unknown {
    if (!!!value) {
      return '-';
    }
    let name = '';
    if (typeof value === 'string') {
      name = value;
    } else if (typeof value === 'object') {
      const data = value as AssetInvestigationAssetOwners[];
      const custTypeC = data;
      if (custTypeC.length > 0) {
        name =
          custTypeC
            .map(d => {
              if (d.custTypeConst === 'P') {
                return `${d.identificationNo}-${d.firstname} ${d.lastname}`;
              } else {
                return `${d.identificationNo}-${d.firstname}`;
              }
            })
            .join(',')
            .trim() || '-';
      } else {
        name = '-';
      }
    } else {
      name = '-';
    }
    return name;
  }
}
