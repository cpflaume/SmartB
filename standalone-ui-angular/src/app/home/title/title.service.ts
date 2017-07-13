import  { Injectable } from '@angular/core';
import  { Http } from '@angular/http';

@Injectable()
export class Title {

  public value = 'Smart Bottle';

  constructor(public http: Http) {
  }

  public getData() {
    console.log('Title#getData(): Get Data');
    // this.http.get('/assets/data.json').subscribe().map(res => res.json());
    return {
      value: this.value
    };
  }

}
