import {
  Text,
  createEditor,
  Node,
  Element,
  Editor,
  Descendant,
  BaseEditor,
} from 'slate'
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';
import { NodeTypes } from 'remark-slate';

export type BlockQuoteElement = { type: NodeTypes['block_quote']; children: Descendant[] }

export type HeadingTwoElement = { type: NodeTypes['heading']['2']; children: Descendant[] }

export type ImageElement = {
  type: NodeTypes['image'];
  link: string;
  /** Images with no caption are link images */
  caption: string;
  children: EmptyText[];
}

export type LinkElement = { type: NodeTypes['link']; link: string; children: CustomText[] }

export type ParagraphElement = { type: NodeTypes['paragraph']; children: Descendant[], break?: boolean }

type CustomElement =
  | BlockQuoteElement
  | HeadingTwoElement
  | ImageElement
  | LinkElement
  | ParagraphElement
  // | CustomText
  ;

export type CustomText = {
  bold?: boolean
  italic?: boolean
  code?: boolean
  underline?: boolean
  text: string
}

export type EmptyText = {
  text: string
}

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText | EmptyText
  }
}