import { Component, Input } from '@angular/core';
import Contact from "../contact";
import ContactService from "../contact.service";

@Component({
  selector: 'contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css']
})
export class ContactDetailsComponent {
  @Input()
  contact: Contact;

  @Input()
  createHandler: Function;

  @Input()
  updateHandler: Function;

  @Input()
  deleteHandler: Function;

  constructor(private contactService: ContactService) { }

  createContact(contact: Contact) {
    this.contactService
      .create(contact)
      .then(newContact => {
        this.createHandler(newContact);
      });
  }

  updateContact(contact: Contact) {
    this.contactService
      .update(contact)
      .then(updatedContact => {
        this.updateHandler(updatedContact);
      });
  }

  deleteContact(contactId: string) {
    this.contactService
      .delete(contactId)
      .then(deletedContact => {
        // @ts-ignore
        this.deleteHandler(deletedContact["deletedId"]);
      });
  }
}
