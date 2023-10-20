import Contact from "./contact";
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";

@Injectable()
export default class ContactService {
  private APIUrl: string = "/v1/contacts";

  /**
   * Выводит сообщение об ошибке
   * @param error
   */
  private handleError(error: any): void {
    const message = error.message
      ? error.message
      : error.status
        ? `${error.status} - ${error.statusText}`
        : "Ошибка сервера";

    console.error(message);
  }

  public constructor(private http: HttpClient) { }

  /**
   * Создаёт запись в БД
   * @param contact      создаваемый документ
   */
  public async create(contact: Contact) {
    const result = this.http.post<Contact>(this.APIUrl, contact);
    return await firstValueFrom(result);
  }

  /**
   * Выбирает записи из БД
   */
  public async read() {
    const result = this.http.get<Contact[]>(this.APIUrl);
    console.log(result);
    return await firstValueFrom(result);
  }

  /**
   * Обновляет запись из БД
   * @param contact     обновляемый документ
   */
  public async update(contact: Contact) {
    const result = this.http.put<Contact>(`${this.APIUrl}/${contact._id}`, contact);
    return await firstValueFrom(result);
  }

  /**
   * Удаляет запись из БД
   * @param id      id удаляемого документа
   */
  public async delete(id: string) {
    const result =  this.http.delete(`${this.APIUrl}/${id}`);
    return await firstValueFrom(result);
  }
}
