'use client';

import { X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';

export function LoginModal() {
  const { isLoginModalOpen, closeLoginModal } = useAuth();

  return (
    <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal}>
      <div className="relative bg-[#121212]/90 border border-white/10 rounded-2xl p-8 w-full max-w-sm">
        <button
          onClick={closeLoginModal}
          className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <span className="text-xl font-bold tracking-tight text-white">
            FrameMeta
          </span>
        </div>

        <div className="border-t border-white/10 mb-6" />

        <h2 className="text-lg font-bold text-white text-center mb-2">
          Log in to interact
        </h2>

        <p className="text-sm text-white/50 text-center mb-8">
          Like and comment on clips by creating a free account
        </p>

        <Button
          variant="default"
          className="w-full mb-3"
          onClick={closeLoginModal}
        >
          Log in
        </Button>

        <Button
          variant="outline"
          className="w-full"
          onClick={closeLoginModal}
        >
          Sign up
        </Button>
      </div>
    </Modal>
  );
}
