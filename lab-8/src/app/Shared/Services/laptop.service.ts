import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { laptop } from '../Models/laptop.model';
import { v4 as uuidv4 } from 'uuid';


@Injectable({
  providedIn: 'root'
})
export class LaptopService {

  private url = 'http://localhost:3000/laptops';

  public getLaptops() : Observable<laptop[]> {
    return this.http.get<laptop[]>(this.url)
  }

  public addLaptop(Laptop : laptop) {
    Laptop.id = uuidv4();
    return this.http.post<laptop>(this.url, Laptop);
  }
  public updateLaptop(Laptop: laptop){
    return this.http.put<laptop>(`${this.url}/${Laptop.id}`, Laptop);
  }

  public deleteLaptop ( id: string){
    return this.http.delete(`${this.url}/${id}`);
  }

  public findLaptopByName (modelName: string){
    return this.http.get<laptop[]>(this.url,{
      params: new HttpParams().set('name_like', modelName)
    });
  }

  constructor(private http: HttpClient) { }
}


