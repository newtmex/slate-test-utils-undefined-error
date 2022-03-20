import React, { Ref, PropsWithChildren } from 'react'
import {
    Editor,
    Transforms,
} from 'slate'
import { useSlate } from 'slate-react';
import { TextFormat, toggleMark, BlockFormat, isBlockActive, isMarkActive } from '../functions';
import { CustomElement} from '../slate';

interface BaseProps {
    className: string
    [key: string]: unknown
}



interface TextFormating<Format> { format: Format, iconClass: string }

export const Button = React.forwardRef(
    function button(
        {
            className,
            active,
            reversed,
            ...props
        }: PropsWithChildren<
            {
                active: boolean
                reversed: boolean
            } & BaseProps
        >,
        ref: Ref<HTMLSpanElement> | undefined
    ) {
        return (
            <span
                className="Button"
                style={{
                    color: reversed
                        ? active
                            ? 'white'
                            : '#aaa'
                        : active
                            ? 'black'
                            : '#ccc'
                }}
                {...props}
                ref={ref}
            />
        )
    }
);


export const Menu = React.forwardRef(
    function menu(
        { className, ...props }: PropsWithChildren<BaseProps>,
        ref: Ref<HTMLDivElement> | undefined
    ) {
        return (
            <div
                {...props}
                ref={ref}
                className="Menu"
            />
        )
    }
)


export const Toolbar = React.forwardRef(
    function toolbar(
        { className, ...props }: PropsWithChildren<BaseProps>,
        ref: Ref<HTMLDivElement> | undefined
    ) {
        return (
            <div className="Toolbar">
                <Menu
                    {...props}
                    ref={ref}
                />
            </div>
        )
    }
)

export const MarkButton = ({ format, iconClass }: TextFormating<TextFormat>) => {
    const editor = useSlate()
    return (
        <Button
            active={isMarkActive(editor, format)}
            onMouseDown={(event: MouseEvent) => {
                event.preventDefault()
                toggleMark(editor, format)
            }}
        >
            <i className={iconClass}></i>
        </Button>
    )
}

export const BlockButton = ({ format, iconClass }: TextFormating<BlockFormat>) => {
    const editor = useSlate();
    
    const toggleBlock = (editor: Editor, format: BlockFormat) => {
        const isActive = isBlockActive(editor, format);
    
        if (format != "link") {
            const newProperties: Partial<CustomElement> = {
                type: isActive
                    ? 'paragraph'
                    : format
            }
    
            Transforms.setNodes(editor, newProperties);
        }
    }
    return (
        <Button
            active={isBlockActive(editor, format)}
            onMouseDown={(event: MouseEvent) => {
                event.preventDefault()
                toggleBlock(editor, format)
            }}
        >
            <i className={iconClass} />
        </Button>
    )
}