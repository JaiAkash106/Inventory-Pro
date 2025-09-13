'use client'

import { AlertTriangle } from 'lucide-react'
import { Modal } from './Modal'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const typeStyles = {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    info: 'bg-blue-600 hover:bg-blue-700 text-white'
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${
            type === 'danger' ? 'bg-red-100 dark:bg-red-900' :
            type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900' :
            'bg-blue-100 dark:bg-blue-900'
          }`}>
            <AlertTriangle className={`w-5 h-5 ${
              type === 'danger' ? 'text-red-600 dark:text-red-400' :
              type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
              'text-blue-600 dark:text-blue-400'
            }`} />
          </div>
          <p className="text-gray-700 dark:text-gray-300">{message}</p>
        </div>
        
        <div className="flex space-x-3 justify-end">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-lg transition-colors ${typeStyles[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}