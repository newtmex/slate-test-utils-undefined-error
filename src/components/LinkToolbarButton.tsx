import isUrl from "is-url";
import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import {
    Editor,
} from "slate";
import { useSlate } from "slate-react";
import { Button } from ".";
import { isBlockActive, unwrapLink, wrapLink } from "../functions";
import { CustomEditor, CustomText, LinkElement } from "../slate";

export type ShowModal = null | 'confirm' | 'prompt' | 'alert';

const LinkModal = ({ editor, handleClose }: { editor: CustomEditor, handleClose: () => void }) => {

    const [showModal, setShowModal] = useState<ShowModal>(null);
    const [url, setUrl] = useState<string>('');
    const [isActive, setIsActive] = useState<boolean | null>(null);

    const insertLink = (convertLinkToText = false) => {
        unwrapLink(editor);

        if (isActive && convertLinkToText) {

        } else {
            wrapLink(editor, url);
        }

        handleClose()
    }

    useEffect(() => {

        const { selection } = editor
        if (!selection) {
            return;
        }

        let selectedFragment = editor.getFragment()[0];
        let capturedLinkText: string | undefined = undefined;

        while (capturedLinkText === undefined && (selectedFragment as any).children) {
            selectedFragment = (selectedFragment as any).children[0];
            capturedLinkText = (selectedFragment as CustomText).text ?? (selectedFragment as LinkElement).link;
        }

        if (capturedLinkText !== undefined) {

            setUrl(capturedLinkText);

            const [match] = Array.from(
                Editor.nodes(editor, {
                    at: Editor.unhangRange(editor, selection),
                    match: (n) => n == selectedFragment,
                })
            );

            setIsActive(!!match);

            if (isActive) {
                setShowModal('confirm');
            } else {
                setShowModal('prompt');
            }
        } else {
            console.error({ selectedFragment })
        }
    }, []);

    return (
        <Modal
            show={true}
            backdrop='static'
            keyboard={false}
            onHide={handleClose}
        >
            {
                showModal == 'confirm' && (
                    <>
                        <Modal.Header>
                            Convert link to text?
                        </Modal.Header>
                        <Modal.Footer>
                            <button
                                className='btn'
                                onClick={() => {
                                    setShowModal('prompt');
                                }}>
                                No
                            </button>
                            <button
                                className='btn'
                                style={{ color: 'red' }}
                                onClick={() => {
                                    insertLink(true)
                                }}>
                                Yes
                            </button>
                        </Modal.Footer>
                    </>
                )
            }
            {
                showModal == 'prompt' && (
                    <>
                        <Modal.Header>
                            Enter the URL of the link:
                        </Modal.Header>

                        <Modal.Body>
                            <input type="text" data-testid='link-modal-url-input' value={url} onChange={({ target: { value } }) => setUrl(value)} />
                        </Modal.Body>

                        <Modal.Footer>
                            <button
                                className='btn'
                                style={{ color: 'red' }} onClick={handleClose}>
                                Cancel
                            </button>
                            <button
                                data-testid='link-modal-done-button'
                                className='btn'
                                style={{ color: 'green' }}
                                onClick={() => {
                                    if (!url) {
                                        handleClose()
                                        return;
                                    }

                                    if (isUrl(url)) {
                                        insertLink();
                                    } else {
                                        setShowModal('alert')
                                    }
                                }
                                }>
                                Done
                            </button>
                        </Modal.Footer>
                    </>
                )
            }
            {
                showModal == 'alert' && (
                    <>
                        <Modal.Header style={{ color: 'red' }}>
                            Please enter a valid url
                        </Modal.Header>
                        <Modal.Footer>
                            <button
                                data-testid='link-modal-alert-okay-button'
                                className='btn'
                                onClick={() => {
                                    setShowModal('prompt');
                                }}>
                                Okay
                            </button>
                        </Modal.Footer>
                    </>
                )
            }

        </Modal>
    )
}

export const LinkToolbarButton = () => {
    const editor = useSlate()
    const [showModal, setShowModal] = useState(false);

    const onMouseDown = (event: MouseEvent) => {
        event.preventDefault();
        setShowModal(true);
    }

    return (
        <>
            <Button
                data-testid='link-toolbar-button'
                active={isBlockActive(editor, 'link')}
                onMouseDown={onMouseDown}
            >
                <i className="bi bi-link" />
            </Button>

            {showModal && <LinkModal
                editor={editor}
                handleClose={() => {
                    setShowModal(false)
                }}
            />
            }
        </>
    )
}