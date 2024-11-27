export interface ICatDocumentation {
  _id: string
  name: string
}

export interface IDocumentation {
  _id: string
  value: string
  catDocumentation: ICatDocumentation
}
