import { Button } from '@heroui/react'
import { AnimatePresence, motion } from 'framer-motion'

interface FormActionsProps {
  visible: boolean
  isSaving?: boolean
  onCancel: () => void
  submitText?: string
  cancelText?: string
}

export const FormActions = ({
  visible,
  isSaving = false,
  onCancel,
  submitText = 'Guardar cambios',
  cancelText = 'Cancelar',
}: FormActionsProps) => {
  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key="form-actions"
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-4"
        >
          <div className="flex w-full max-w-sm gap-2 rounded-2xl border border-divider bg-content1/90 backdrop-blur-xl p-2 shadow-xl">
            <Button
              variant="flat"
              className="w-full"
              onPress={onCancel}
            >
              {cancelText}
            </Button>

            <Button
              color="primary"
              className="w-full"
              type="submit"
              isLoading={isSaving}
            >
              {submitText}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}