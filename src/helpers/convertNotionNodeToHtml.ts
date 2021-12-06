/* eslint-disable @typescript-eslint/no-use-before-define */

import {
  NotionPropertyAsDate,
  NotionPropertyAsFiles,
  NotionPropertyAsLastEditedTime,
  NotionPropertyAsRichText,
  NotionPropertyAsSelect,
  NotionPropertyAsTitle,
} from '../types/Notion'
import convertMarkdownToHtml from './convertMarkdownToHtml'
import convertMarkdownToInlineHtml from './convertMarkdownToInlineHtml'
import handleError from './handleError'
import humanizeDate from './humanizeDate'

export default function convertNotionNodeToHtml(
  value:
    | NotionPropertyAsDate
    | NotionPropertyAsFiles
    | NotionPropertyAsLastEditedTime
    | NotionPropertyAsRichText
    | NotionPropertyAsSelect
    | NotionPropertyAsTitle,
  isInline: boolean = false,
): string | undefined {
  try {
    switch (value.type) {
      case 'date':
        return fromDate(value)

      case 'files':
        return fromFiles(value)

      case 'last_edited_time':
        return fromLastEditedTime(value)

      case 'rich_text':
        return fromRichText(value, isInline)

      case 'select':
        return fromSelect(value, isInline)

      case 'title':
        return fromTitle(value, isInline)

      default:
        return undefined
    }
  } catch (err) {
    handleError(err, 'helpers/convertNotionNodeToHtml()')
  }
}

function fromDate(value: NotionPropertyAsDate): string | undefined {
  if (value.date === null || value.date.start === null) {
    return undefined
  }

  return humanizeDate(value.date.start)
}

function fromFiles(value: NotionPropertyAsFiles): string | undefined {
  if (value.files.length === 0) {
    return undefined
  }

  const firstFile = value.files[0]

  if (firstFile.type === 'external') {
    return firstFile.external.url
  }

  return firstFile.file.url
}

function fromLastEditedTime(value: NotionPropertyAsLastEditedTime): string | undefined {
  return humanizeDate(value.last_edited_time)
}

function fromRichText(value: NotionPropertyAsRichText, isInline: boolean): string {
  const markdownSource = value.rich_text.map(richTextChild => richTextChild.plain_text).join('')

  if (isInline) {
    return convertMarkdownToInlineHtml(markdownSource)
  }

  return convertMarkdownToHtml(markdownSource)
}

function fromSelect(value: NotionPropertyAsSelect, isInline): string | undefined {
  if (value.select === null) {
    return undefined
  }

  const markdownSource = value.select.name

  if (isInline) {
    return convertMarkdownToInlineHtml(markdownSource)
  }

  return convertMarkdownToHtml(markdownSource)
}

function fromTitle(value: NotionPropertyAsTitle, isInline: boolean): string {
  const markdownSource = value.title.map(titleChild => titleChild.plain_text).join('')

  if (isInline) {
    return convertMarkdownToInlineHtml(markdownSource)
  }

  return convertMarkdownToHtml(markdownSource)
}
