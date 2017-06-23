import {Item} from "./item.model";

export interface Bucketlist {
  id: number;
  name: string;
  items: Item[];
  date_created: string;
  date_modified: string;
  created_by: number;
}
