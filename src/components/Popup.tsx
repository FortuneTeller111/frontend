"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

const Popup = ({
  isOpen = true,
  onClose = () => {},
  data = "",
  className = "",
  closeTag = false,
  title = "",
}) => {
  return (
    <div>
      <Dialog open={isOpen} onClose={onClose} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="bg-[url(/images/popup-bg.png)] bg-cover w-[456px] h-[330px] px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <button className="w-full flex justify-end pt-1"><img src="/images/popup-close.png" className="w-6 h-6"/> </button>
              
             
                <div className="h-[85%] flex justify-center items-center">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    {title && (
                      <DialogTitle
                        as="h3"
                        className="text-base font-semibold text-white"
                      >
                        {title}
                      </DialogTitle>
                    )}
                    <div>
                      <p className="text-sm text-gray-400">
                        Are you sure you want to deactivate your account? All of
                        your data will be permanently removed. This action
                        cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Popup;
