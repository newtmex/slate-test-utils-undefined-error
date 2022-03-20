declare namespace JSX {
  interface IntrinsicElements {
    editor: any
    hbq: any
    hh2: any
    himage: any
    hlink: {
      link: string
      children: any
    }
    hp: any
    cursor: any
    focus: any
    anchor: any
    htext: {
      // These optional params will show up in the autocomplete!
      bold?: boolean
      underline?: boolean
      italic?: boolean
      children?: any
    }
  }
}