import React from 'react';
import Button from './input/Button';
import okayIcon from "../../../../public/images/ok.png";
import ErrorIcon from "../../../../public/images/error-icon-4.png";
import Link from 'next/link';

import Image from 'next/image';
import { IoClose } from 'react-icons/io5';
interface ModalProps {
  isOpen: boolean;
  title?: string;
  children?: React.ReactNode;
}

interface ToasMessageModalProps {
  isOpen: boolean;
  onClose?: () => void;
  type: 'success' | 'error',
  message?: string
};

interface BlogPostModalProps {
  isOpen: boolean;
  message: string;
  onClose?: () => void;
};

interface LogoutModal {
  isOpen: boolean;
  onClose?: () => void;
  handleLogout: () => void;
};

interface SupportTicket {
  isOpen: boolean;
  children: React.ReactElement
};

const Modal: React.FC<ModalProps> = ({ isOpen, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed text-center inset-0  bg-opacity-50 flex items-center justify-center z-[9999] overflow-y-auto">
      <div
        className="
    relative
    overflow-y-auto
    max-h-[90vh]
    lg:w-[420px]
    md:w-[500px]
    w-[92%]

    rounded-[28px]
    border
    border-[#9a39e8]

    bg-[linear-gradient(180deg,#2a0a68_0%,#16053f_100%)]

    shadow-[0_0_30px_rgba(154,57,232,0.35)]

    p-6
  "
      >
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  );
};

export const ToasMessageModal = ({
  isOpen,
  onClose,
  type,
}: ToasMessageModalProps) => {
  return (
    <Modal isOpen={isOpen}>
      <div className="flex flex-col items-center text-center">
        <div
          className="
            mb-5
            flex h-20 w-20 items-center justify-center
            rounded-full
            border border-[#9a39e8]
            bg-[#1b0949]
          "
        >
          <Image
            src={type === "success" ? okayIcon : ErrorIcon}
            width={42}
            height={42}
            alt=""
          />
        </div>

        <h2 className="mb-3 text-xl font-bold text-white">
          {type === "success" ? "Success" : "Error"}
        </h2>

        <p className="text-sm text-[#cbb8ff]">
          A confirmation link has been sent to your email.
          Please check your inbox.
        </p>

        <div className="mt-8 flex w-full gap-3">
          <Link
            href="/login"
            className="
              flex-1
              rounded-full
              border border-[#9a39e8]
              py-3
              text-center
              font-semibold
              text-white
            "
          >
            Login
          </Link>

          <button
            onClick={onClose}
            className="
              flex-1
              cursor-pointer
              rounded-full
              bg-[linear-gradient(180deg,#f3c14d_0%,#e69505_100%)]
              py-3
              font-semibold
              text-black
            "
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export const BlogPostModal = (props: BlogPostModalProps) => {
  const { isOpen, message, onClose } = props;
  return (
    <Modal isOpen={isOpen}>
      <div className='w-full flex flex-col items-center gap-6 '>
        <p>
          {message}
        </p>
        <Button text='Close' onClick={onClose} />
      </div>
    </Modal>
  )
};

export const LogoutModal = ({
  isOpen,
  onClose,
  handleLogout,
}: LogoutModal) => {
  return (
    <Modal isOpen={isOpen}>
      <div className="relative">
        <button
          onClick={onClose}
          className="
            absolute
            right-0
            top-0

            flex
            h-10
            w-10
            items-center
            justify-center

            rounded-full

            border
            border-[#9a39e8]

            bg-[#2d1069]
            cursor-pointer
          "
        >
          <IoClose className="text-white text-xl" />
        </button>

        <h2 className="mb-2 text-2xl font-bold text-white">
          Confirm Logout
        </h2>

        <p className="mb-8 text-[#cbb8ff]">
          Are you sure you want to logout?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="
              flex-1
              rounded-full
              border border-[#9a39e8]
              py-3
              font-semibold
              text-white cursor-pointer
            "
          >
            Cancel
          </button>

          <button
            onClick={handleLogout}
            className="
              flex-1
              rounded-full
              bg-[linear-gradient(180deg,#FEDB1E_0%,#E48A06_100%)]
              py-3
              font-semibold
              text-black
              cursor-pointer
            "
          >
            Logout
          </button>
        </div>
      </div>
    </Modal>
  );
};

export const SuprtTicketModal = (props: SupportTicket) => {
  const { isOpen, children } = props;
  return (
    <Modal isOpen={isOpen}>
      {children}
    </Modal>
  )
};

export default Modal;
