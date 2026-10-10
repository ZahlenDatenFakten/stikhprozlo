import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Smartphone, Copy, Check, Wifi } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileConnectModal({ isOpen, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState('http://192.168.1.103:3000');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const port = window.location.port ? `:${window.location.port}` : '';
      const protocol = window.location.protocol;
      
      // Если открыто с localhost или 127.0.0.1 на ПК, подставляем локальный IP в Wi-Fi сети
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        setUrl(`http://192.168.1.103${port || ':3000'}`);
      } else {
        setUrl(`${protocol}//${hostname}${port}`);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-[#d9a441]/40 bg-[#0e0c0a]/95 p-6 sm:p-8 text-center shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(217,164,65,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute right-4 top-4 rounded-full p-2 text-[#a89c8d] hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Иконка смартфона */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#d9a441]/30 bg-[#d9a441]/10 shadow-[0_0_20px_rgba(217,164,65,0.2)]">
          <Smartphone className="h-6 w-6 text-[#f0c169]" />
        </div>

        <h3 className="font-display mt-4 text-2xl font-light tracking-wide text-[#f5efe6]">
          Просмотр на телефоне
        </h3>

        <p className="font-poem mt-2 text-sm italic text-[#c7beaf]">
          Наведите камеру телефона на QR-код для мгновенного погружения в альбом без ручного ввода.
        </p>

        {/* Контейнер QR-кода */}
        <div className="mx-auto my-6 flex w-fit items-center justify-center rounded-2xl border border-[#d9a441]/30 bg-[#060504] p-4 shadow-[0_0_25px_rgba(217,164,65,0.15)]">
          <QRCodeSVG
            value={url}
            size={180}
            bgColor="#060504"
            fgColor="#f0c169"
            level="M"
            marginSize={1}
          />
        </div>

        {/* Адрес подключения */}
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-left">
          <div className="overflow-hidden">
            <span className="block font-ui text-[10px] tracking-wider uppercase text-[#a89c8d]">
              Адрес в сети Wi-Fi:
            </span>
            <span className="block truncate font-mono text-xs text-[#f5efe6]">{url}</span>
          </div>

          <button
            onClick={handleCopy}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#d9a441]/30 bg-[#d9a441]/10 text-[#d9a441] hover:bg-[#d9a441]/20 transition-colors cursor-pointer ml-2"
            title="Скопировать ссылку"
          >
            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>

        {/* Подсказка о Wi-Fi */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-ui text-[#a89c8d]/70">
          <Wifi className="h-3.5 w-3.5 text-[#d9a441]" />
          <span>Телефон и компьютер должны быть в одной Wi-Fi сети</span>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-full border border-[#d9a441]/40 bg-[#d9a441]/15 py-2.5 font-ui text-xs tracking-wider uppercase text-[#f5efe6] hover:bg-[#d9a441]/25 transition-colors cursor-pointer"
        >
          Готово
        </button>
      </div>
    </div>
  );
}
