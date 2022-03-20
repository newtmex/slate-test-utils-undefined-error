import { CustomEditor, CustomElement, LinkElement } from "./slate"
import { Editor, Transforms, Element as SlateElement, Range } from 'slate';

export type BlockFormat = Partial<CustomElement['type']>;

export type TextFormat = 'bold'
    | 'italic'
    | 'underline'
    | 'code';

export const isMarkActive = (editor: Editor, format: TextFormat) => {
    const marks = Editor.marks(editor)
    return marks ? (marks as any)[format] === true : false
}

export const toggleMark = (editor: CustomEditor, format: TextFormat) => {
    const isActive = isMarkActive(editor, format)

    if (isActive) {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, true)
    }
}

export const isBlockActive = (editor: Editor, format: BlockFormat) => {
    const { selection } = editor
    if (!selection) return false

    const [match] = Array.from(
        Editor.nodes(editor, {
            at: Editor.unhangRange(editor, selection),
            match: (n) =>
                !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
        })
    );

    return !!match
}

export const unwrapLink = (editor: CustomEditor) => {
    Transforms.unwrapNodes(editor, {
        match: n =>
            !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
    })
}

export const wrapLink = (editor: CustomEditor, url: string) => {
    if (isBlockActive(editor, "link")) {
        unwrapLink(editor);
    }

    const { selection } = editor
    const isCollapsed = selection && Range.isCollapsed(selection)
    const link: LinkElement = {
        type: 'link',
        link: url,
        children: isCollapsed ? [{ text: url }] : [],
    }

    if (isCollapsed) {
        Transforms.insertNodes(editor, link)
    } else {
        Transforms.wrapNodes(editor, link, { split: true })
        Transforms.collapse(editor, { edge: 'end' })
    }
}