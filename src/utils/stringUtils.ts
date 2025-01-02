export const filenameToTitle = (filename: string | undefined) => {
  if (!filename) return 'Untitled'

  return filename.replace(/\.md$/, '') || 'Untitled'
}
