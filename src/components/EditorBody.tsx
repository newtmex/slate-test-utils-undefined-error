import React, { FC, PropsWithChildren, Ref, useEffect, useMemo, useState } from "react";
import { createEditor, Descendant, Editor, Transforms } from "slate";
import { Toolbar, MarkButton, BlockButton } from ".";
import isHotkey from 'is-hotkey';
import { withReact, Slate, Editable, ReactEditor, useFocused, useSelected, useSlate } from "slate-react";
import { withHistory } from "slate-history";
import { withImages, withLinks } from "../plugins";
import { LinkToolbarButton } from "./LinkToolbarButton";
import { toggleMark } from "../functions";
import { CustomElement, LinkElement, ImageElement } from "../slate";
import Image from "next/image";

export interface EditorBodyProps {
    editor?: Editor
    initialValue: Descendant[]
    children?: React.ReactNode
    onBodyUpdate: (value: Descendant[]) => void
};

export const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code',
}

export const emptyBody: Descendant[] = [{ type: 'paragraph', children: [{ text: '' }] }];

export const EditorElement = (props: PropsWithChildren<{ attributes: any; element: CustomElement }>) => {
    const { attributes, children, element } = props;

    switch (element.type) {
        case 'image':
            return <AfrikImage element={element} {...attributes}>{children}</AfrikImage>
        case 'block_quote':
            return <blockquote {...attributes}>{children}</blockquote>
        case 'heading_two':
            return <h2 {...attributes}>{children}</h2>
        case 'link':
            return <AfrikLink element={element} {...attributes}>{children}</AfrikLink>
        case 'paragraph':
            return <p {...attributes}>{children}</p>
        default:
            return <span {...attributes}>{children}</span>
    }
}

const AfrikLink = React.forwardRef(
    function AfrikLink(
        { element, attributes, children }: { element: LinkElement, attributes: any, children: React.ReactNode },
        ref: Ref<HTMLAnchorElement> | undefined
    ) {
        const editor = useSlate();

        return (
            <a
                onClick={(event) => {
                    event.preventDefault();
                    Transforms.select(editor, ReactEditor.findPath(editor, element))
                }}
                href={element.link} {...attributes} target="_blank" rel="noreferrer">{children}</a>
        )
    }
);

const AfrikImage = React.forwardRef(
    function AfrikImage(
        { element, attributes, children }: { element: ImageElement, attributes: any, children: React.ReactNode },
        ref: Ref<HTMLDivElement> | undefined
    ) {
        const selected = useSelected();
        const focused = useFocused();
        const editor = useSlate();

        return (
            <div
                ref={ref} {...attributes} onClick={(event) => {
                    event.preventDefault();
                    Transforms.select(editor, ReactEditor.findPath(editor, element))
                }} >
                <div contentEditable={false}
                    style={{ position: 'relative', height: '20rem' }}
                >
                    <Image
                        src={element.link}
                        alt={element.caption}
                        className={selected && focused ? 'selected focused' : ''}
                        layout="fill"
                        objectFit="contain"
                        objectPosition="center"
                    />
                </div>
                {
                    /* see https://github.com/ianstormtaylor/slate/issues/3930#issuecomment-723288696 */
                    children
                }
            </div>

        )
    }
);

export const LeafElement = ({ attributes, children, leaf }: { attributes: any, children: any, leaf: any }): JSX.Element => {
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }

    if (leaf.code) {
        children = <code>{children}</code>
    }

    if (leaf.italic) {
        children = <em>{children}</em>
    }

    if (leaf.underline) {
        children = <u>{children}</u>
    }

    return <span {...attributes}>{children}</span>
}

/**
 * This is our custom Slate Editor
 */
const EditorBody: FC<EditorBodyProps> = ({
    editor: mockEditor,
    initialValue,
    children,
    onBodyUpdate
}) => {
    const renderElement = React.useCallback((props) => <EditorElement {...props} />, []);
    const renderLeaf = React.useCallback((props) => <LeafElement {...props} />, []);
    const [body, setBody] = useState(initialValue);

    const editor = useMemo(
        () =>
            withImages(
                withLinks(
                    withReact(
                        withHistory(mockEditor ?? createEditor())
                    )
                )
            )
        ,
        [mockEditor]
    );

    useEffect(() => {
        onBodyUpdate(body)
    }, [body]);

    return (
        <Slate
            editor={editor}
            value={body}
            onChange={value => setBody(value)}
        >
            <Toolbar>
                <MarkButton format="bold" iconClass="bi bi-type-bold" />
                <MarkButton format="italic" iconClass="bi bi-type-italic" />
                <MarkButton format="underline" iconClass="bi bi-type-underline" />
                <MarkButton format="code" iconClass="bi bi-code" />
                <BlockButton format="heading_two" iconClass="bi bi-type-h2" />
                <BlockButton format="block_quote" iconClass="bi bi-blockquote-left" />
                <LinkToolbarButton />
            </Toolbar>
            <Editable
                data-testid="slate-content-editable"
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                placeholder="Start Writing"
                className="Editor"
                spellCheck
                autoFocus
                onKeyDown={event => {
                    for (const hotkey in HOTKEYS) {
                        if (isHotkey(hotkey, event as any)) {
                            event.preventDefault()
                            const mark = (HOTKEYS as any)[hotkey]
                            toggleMark(editor, mark)
                        }
                    }
                }}
            />

            {children}
        </Slate>
    )
}

export default EditorBody;