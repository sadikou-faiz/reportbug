import React, { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

type props = {
    code?: string;
    language?: string;
    envVar1?: string
    envVar2?: string

}

const CodeBlockWithCopy = ({ code, language, envVar1, envVar2 }: props) => {
    const [copied, setCopied] = useState(false)
    const fullText = [envVar1, envVar2, code].filter(Boolean).join('\n')

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(fullText);
            setCopied(true)
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div className='relative group my-4'>
            <button
                onClick={handleCopy}
                className='absolute top-2 right-2 z-10 btn btn-xs'
            >
                {copied ? "copié !" : "copier"}
            </button>

            {(envVar1 || envVar2) && (
                <SyntaxHighlighter
                    language='bash'
                    style={materialDark}
                    showLineNumbers={false}
                    customStyle={{
                        borderRadius: '0.5rem',
                        paddingTop: '1.5rem',
                        fontSize: '0.875rem',
                    }}
                >
                    {[envVar1, envVar2].filter(Boolean).join('\n')}
                </SyntaxHighlighter>
            )}

            {code && (
                <SyntaxHighlighter
                    language={language}
                    style={materialDark}
                    showLineNumbers={true}
                    customStyle={{
                        borderRadius: '0.5rem',
                        paddingTop: '2.5rem',
                        fontSize: '0.875rem',
                    }}
                >
                   {code}
                </SyntaxHighlighter>
            )}




        </div>
    )
}

export default CodeBlockWithCopy

