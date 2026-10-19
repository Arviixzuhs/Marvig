import type { Components } from 'react-markdown'

export const markdownComponents: Components = {
  h1: (props) => (
    <h1 className='text-lg font-bold mt-4 mb-2 first:mt-0 tracking-tight' {...props} />
  ),
  h2: (props) => (
    <h2
      className='text-base font-semibold mt-4 mb-2 first:mt-0 pb-1 border-b border-current/10'
      {...props}
    />
  ),
  h3: (props) => <h3 className='text-sm font-semibold mt-3 mb-1.5 first:mt-0' {...props} />,
  h4: (props) => <h4 className='text-sm font-medium mt-3 mb-1 first:mt-0 opacity-80' {...props} />,

  p: (props) => <p className='leading-relaxed my-2 first:mt-0 last:mb-0' {...props} />,
  strong: (props) => <strong className='font-semibold' {...props} />,
  em: (props) => <em className='italic opacity-90' {...props} />,
  hr: () => <hr className='my-4 border-current/10' />,

  ul: (props) => <ul className='list-disc pl-5 my-2 space-y-1 marker:opacity-50' {...props} />,
  ol: (props) => <ol className='list-decimal pl-5 my-2 space-y-1 marker:opacity-60' {...props} />,
  li: (props) => <li className='leading-relaxed pl-0.5' {...props} />,

  a: (props) => (
    <a
      className='text-blue-500 dark:text-blue-400 underline underline-offset-2 decoration-current/30 hover:decoration-current transition-colors'
      target='_blank'
      rel='noopener noreferrer'
      {...props}
    />
  ),

  blockquote: (props) => (
    <blockquote
      className='my-3 pl-3 border-l-4 border-orange-500/60 bg-orange-500/5 py-1 rounded-r-lg opacity-90'
      {...props}
    />
  ),

  // Tablas: el wrapper permite scroll horizontal sin romper la burbuja
  table: (props) => (
    <div className='my-3 overflow-x-auto rounded-xl border border-current/10'>
      <table className='w-full text-xs border-collapse' {...props} />
    </div>
  ),
  thead: (props) => <thead className='bg-current/5' {...props} />,
  th: (props) => (
    <th
      className='px-3 py-2 text-left font-semibold whitespace-nowrap border-b border-current/10'
      {...props}
    />
  ),
  td: (props) => (
    <td className='px-3 py-2 align-top border-b border-current/5 last:border-b-0' {...props} />
  ),
  tr: (props) => <tr className='even:bg-current/[0.03]' {...props} />,

  pre: (props) => (
    <pre
      className='my-3 p-3 overflow-x-auto rounded-xl bg-black/80 text-gray-100 text-xs leading-relaxed'
      {...props}
    />
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = /language-/.test(className ?? '') || String(children).includes('\n')

    return isBlock ? (
      <code className={`font-mono ${className ?? ''}`} {...props}>
        {children}
      </code>
    ) : (
      <code className='px-1.5 py-0.5 rounded-md bg-current/10 font-mono text-[0.85em]' {...props}>
        {children}
      </code>
    )
  },
}
