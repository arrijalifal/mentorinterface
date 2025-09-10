import React from 'react';

export default function UploadProgramSequence({ data}: { data: Array<object>}) {
    const handleDownload = () => {
        // 2. Ubah ke string JSON
        const jsonStr = JSON.stringify(data, null, 2); // `null, 2` untuk indentasi agar rapi

        // 3. Buat blob
        const blob = new Blob([jsonStr], { type: 'application/json' });

        // 4. Buat URL dan element <a>
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const date = new Date();
        a.download = `${date.toLocaleString()}.json`; // nama file

        // 5. Klik link untuk trigger download
        a.click();

        // 6. Hapus URL dari memori
        URL.revokeObjectURL(url);
    };

    return (
        <button onClick={handleDownload} className='buttonstyle'>
            Upload JSON
        </button>
    );
}
