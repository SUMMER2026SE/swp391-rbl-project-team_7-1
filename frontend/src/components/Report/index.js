/**
 * Report Module - Self-contained report violation interface.
 *
 * Usage:
 *   import { openReportModal } from '../components/Report';
 *   openReportModal(targetUserId, targetUserName);
 *
 * The modal will be rendered via a portal and does not require
 * any changes to existing page components, routing, or state management.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import ReportModal from './ReportModal';

let modalRoot = null;
let rootInstance = null;

function createModalContainer() {
  const div = document.createElement('div');
  div.id = 'report-modal-root';
  document.body.appendChild(div);
  return div;
}

function removeModalContainer() {
  const existing = document.getElementById('report-modal-root');
  if (existing) {
    document.body.removeChild(existing);
  }
}

function renderModal(targetUserId, targetUserName) {
  // Clean up any existing modal instance first
  destroyModal();

  modalRoot = createModalContainer();
  rootInstance = createRoot(modalRoot);

  const handleClose = () => {
    destroyModal();
  };

  rootInstance.render(
    <ReportModal
      isOpen={true}
      onClose={handleClose}
      targetUserId={targetUserId}
      targetUserName={targetUserName}
    />
  );
}

function destroyModal() {
  if (rootInstance) {
    rootInstance.unmount();
    rootInstance = null;
  }
  if (modalRoot) {
    removeModalContainer();
    modalRoot = null;
  }
}

/**
 * Opens the report violation modal for a given target user.
 *
 * @param {number|string} targetUserId - The ID of the user being reported.
 * @param {string} [targetUserName] - Optional display name of the user being reported.
 */
export function openReportModal(targetUserId, targetUserName) {
  renderModal(targetUserId, targetUserName);
}

export { default as ReportModal } from './ReportModal';