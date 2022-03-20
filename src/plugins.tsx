import imageExtensions from 'image-extensions';
import isUrl from "is-url";
import { Transforms } from 'slate';
import { wrapLink } from './functions';
import { CustomEditor,ImageElement } from './slate';

type SlatePlugin = (editor: CustomEditor) => CustomEditor;

export const withImages: SlatePlugin = editor => {
    const { insertData, isVoid, normalizeNode } = editor

    const insertImage = (editor: CustomEditor, url: string, caption: string) => {
        const text = { text: '' }
        const image: ImageElement = { type: 'image', link: url, caption, children: [text] }

        Transforms.insertNodes(editor, image);
    }

    const isImageUrl = (url: string) => {
        if (!url) return false
        if (!isUrl(url)) return false
        const ext = new URL(url).pathname.split('.').pop()
        
        return imageExtensions.includes(ext as string)
    };

    editor.isVoid = element => {
        return element.type === 'image' ? true : isVoid(element)
    }

    editor.insertData = data => {
        const text = data.getData('text/plain')
        const { files } = data;

        if (files && files.length > 0) {
            for (const file of files) {
                const reader = new FileReader()
                const [mime, extention] = file.type.split('/')

                if (mime === 'image') {
                    reader.addEventListener('load', () => {
                        const url = reader.result;

                        let caption = file.name;
                        caption = caption.substring(0, caption.indexOf(`.${extention}`));

                        if (url) {
                            insertImage(editor, url.toString(), caption)
                        } else {
                            throw 'image url should not be null'
                        }
                    })

                    reader.readAsDataURL(file)
                }
            }
        } else if (isImageUrl(text)) {
            insertImage(editor, text, '')
        } else {
            insertData(data)
        }
    }

    return editor
}

export const withLinks: SlatePlugin = editor => {
    const { insertData, insertText, isInline } = editor

    editor.isInline = element => {
        return element.type === 'link' ? true : isInline(element)
    }

    editor.insertText = text => {
        if (text && isUrl(text)) {
            wrapLink(editor, text)
        } else {
            insertText(text)
        }
    }

    editor.insertData = data => {
        const text = data.getData('text/plain')

        if (text && isUrl(text)) {
            wrapLink(editor, text)
        } else {
            insertData(data)
        }
    }

    return editor
}