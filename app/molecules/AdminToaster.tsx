import { theme } from '@singularity/core'
import { X } from 'react-feather'
import { toast, ToastBar, Toaster } from 'react-hot-toast'
import styled from 'styled-components'

const Box = styled.div`
  .Toast {
    color: ${p => p.theme.color.body.white};
    border-radius: ${p => p.theme.appearance.borderRadius.medium};
    font-weight: 400;
    padding: 0;

    [role='status'] {
      margin: 0;
      padding: 0.5rem 0;
    }
  }
`

const IconBox = styled.div`
  padding: 0 0 0 1rem;
`

const MessageBox = styled.div`
  padding: 0.25rem 1rem;
`

const Button = styled.button`
  align-items: center;
  align-self: flex-start;
  background-color: transparent;
  /* background-color: ${p => p.theme.color.body.dark}; */
  border: 0;
  /* border-bottom-right-radius: ${p => p.theme.appearance.borderRadius.medium}; */
  /* border-top-right-radius: ${p => p.theme.appearance.borderRadius.medium}; */
  color: ${p => p.theme.color.body.light};
  cursor: pointer;
  display: flex;
  height: 50%;
  padding: 1.25rem 0.5rem;

  :hover {
    /* background-color: ${p => p.theme.color.body.black}; */
  }

  > svg {
    fill: ${p => p.theme.color.body.white};
    height: 1.5rem;
    width: 1.5rem;
  }
`

/** @see https://react-hot-toast.com/docs/toaster */
const TOAST_OPTIONS = {
  className: 'Toast',
  duration: 5000,
  error: {
    duration: Infinity,
    style: {
      background: theme.color.danger.active,
    },
  },
  style: {
    background: theme.color.info.active,
  },
  success: {
    style: {
      background: theme.color.success.active,
    },
  },
}

export function AdminToaster() {
  return (
    <Box>
      <Toaster position="top-center" toastOptions={TOAST_OPTIONS}>
        {thisToast => (
          <ToastBar toast={thisToast}>
            {({ icon, message }) => (
              <>
                {thisToast.type !== 'blank' && <IconBox>{icon}</IconBox>}
                <MessageBox>{message}</MessageBox>
                {thisToast.type === 'error' && (
                  <Button onClick={() => toast.dismiss(thisToast.id)} type="button">
                    <X />
                  </Button>
                )}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
    </Box>
  )
}
