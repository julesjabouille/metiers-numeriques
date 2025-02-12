import { AdminTitle } from '@app/atoms/AdminTitle'
import { Spacer } from '@app/atoms/Spacer'
import {
  formatCandidateApplicationFile,
  formatSeniority,
  getCandidateFullName,
  JobApplicationWithRelation,
} from '@app/libs/candidate'
import { ApplicationSubtitle } from '@app/organisms/CandidatePool/ApplicationSubtitle'
import { handleError } from '@common/helpers/handleError'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import React from 'react'
import { Download } from 'react-feather'
import { toast } from 'react-hot-toast'
import styled from 'styled-components'

const ApplicationHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

type ApplicationHeaderProps = {
  application: JobApplicationWithRelation
}

const downloadApplicationZip = (application: JobApplicationWithRelation) => {
  const filename = `Candidature ${getCandidateFullName(application.candidate)}`

  const zip = new JSZip()
  const folder = zip.folder(filename)

  const { url } = application.cvFile
  const blobPromise = fetch(url).then(response => {
    if (response.status === 200 || response.status === 0) {
      return Promise.resolve(response.blob())
    }

    return Promise.reject(new Error(response.statusText))
  })

  const cvFileName = url.substring(url.lastIndexOf('/'))
  folder?.file(cvFileName, blobPromise)

  folder?.file('candidature.txt', formatCandidateApplicationFile(application))

  zip
    .generateAsync({ type: 'blob' })
    .then(blob => saveAs(blob, filename))
    .catch(e => {
      handleError(e, 'app/organisms/ApplicationHeader.tsx > downloadApplicationZip()')
      toast.error('Une erreur est survenue pendant le téléchargement')
    })
}

export const ApplicationHeader = ({ application }: ApplicationHeaderProps) => (
  <ApplicationHeaderContainer>
    <div>
      <AdminTitle>{getCandidateFullName(application.candidate)}</AdminTitle>
      <Spacer units={0.5} />
      <ApplicationSubtitle>
        {application.candidate.currentJob} • {formatSeniority(application.candidate.seniorityInYears)}
      </ApplicationSubtitle>
    </div>
    <Download onClick={() => downloadApplicationZip(application)} size={32} style={{ cursor: 'pointer' }} />
  </ApplicationHeaderContainer>
)
