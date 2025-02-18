import { Component } from '@angular/core';
import { CustomerService } from '@modules/customer/customer.service';
interface IOnrequest {
  customerId: string;
  name: string;
}
@Component({
  selector: 'app-modal-on-request',
  templateUrl: './modal-on-request.component.html',
  styleUrls: ['./modal-on-request.component.scss'],
})
export class ModalOnRequestComponent {
  content: IOnrequest = {
    customerId: '',
    name: '',
  };
  constructor(private customerService: CustomerService) {}

  dataContext(data: any) {
    this.content = data;
  }

  public async onClose(): Promise<boolean> {
    const { customerId } = this.content;
    let popupStatus = false;

    await this.customerService
      .processOnRequest(customerId)
      .then(res => (popupStatus = true))
      .catch(err => (popupStatus = false));

    return popupStatus;
  }

  get returnData() {
    const data = this.content;
    return {
      data: data,
    };
  }
}
