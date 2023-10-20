import { Component, OnInit } from '@angular/core';
import Contact from "../contact";
import ContactService from "../contact.service";
import { ContactDetailsComponent } from "../contact-details/contact-details.component";

@Component({
  selector: 'contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
  providers: [ContactService]
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];
  selectedContact: Contact;

  constructor(private contactService: ContactService) { }

  private getContactIndex = (contactId: string) => {
    return this.contacts.findIndex(contact => contact._id === contactId);
  }

  /**
   * Метод, вызывающийся на этапе инициализации компонента
   */
  ngOnInit(): void {
    this.contactService
      .read()
      .then(contacts => {
        this.contacts = contacts.map(contact => {
          if (!contact.mobile)
            contact.mobile = "";

          if (!contact.home)
            contact.home = "";

          return contact;
        });
      });
  }

  selectContact(contact: Contact) {
    this.selectedContact = contact;
  }

  /**
   * Создаёт пустой контакт и сразу же его выбирает
   */
  createContact() {
    const contact: Contact = {
      username: "",
      email: "",
      mobile: "",
      home: ""
    };

    this.selectContact(contact);
  }

  /**
   * Удаляет контакт из списка
   * @param contactId     индекс удаляемого контакта
   */
  deleteContact = (contactId: string) => {
    const idx = this.getContactIndex(contactId);

    if (idx !== -1) {
      this.contacts.splice(idx, 1);
    }

    return this.contacts;
  }

  /**
   * Добавляет контакт в список
   * @param contact
   */
  addContact = (contact: Contact) => {
    this.contacts.push(contact);
    this.selectContact(contact);
    return this.contacts;
  }

  /**
   * Обновляет контакт в списке
   * @param contact
   */
  updateContact = (contact: Contact) => {
    // @ts-ignore
    const idx = this.getContactIndex(contact._id);

    if (idx !== -1) {
      this.contacts[idx] = contact;
      this.selectContact(contact);
    }

    return this.contacts;
  }
}
