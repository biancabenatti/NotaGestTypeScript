'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MdAccountCircle } from 'react-icons/md';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Logo from '/assets/Logo.png';
import ArquivoNaoEncontrado from '/assets/arquivo_nao_encontrado.jpg';
import AddFileModal from '../../components/AddFileModal/AddFileModal';
import AddPropertyModal from '../../components/AddPropertyModal/AddPropertyModal'; 
import { IoTrashBinSharp } from "react-icons/io5";
import Link from 'next/link';

const UploadsPage = () => {
    const [files, setFiles] = useState<any[]>([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isPropertyModalOpen, setPropertyModalOpen] = useState(false); // Modal de adicionar imóvel
    const [showMenu, setShowMenu] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filesPerPage] = useState(15);
    const menuRef = useRef(null);
    const router = useRouter();

    const user = {
        name: "Nome do Usuário",
        profileImage: "/path/to/default/profile/image.jpg"
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !(menuRef.current as HTMLElement).contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);

    const addFile = (fileData: { title: string; observation: string }) => {
        const newFileData = {
            ...fileData,
            date: new Date().toLocaleString(),
        };
        setFiles([...files, newFileData]);
        setModalOpen(false);
    };

    const deleteFile = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
    };

    const handleLogoff = () => {
        console.log("Usuário deslogado");
        router.push('/');
    };

    const indexOfLastFile = currentPage * filesPerPage;
    const indexOfFirstFile = indexOfLastFile - filesPerPage;
    const currentFiles = files.slice(indexOfFirstFile, indexOfLastFile);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="min-h-screen bg-[#FAFAFC] font-['Plus_Jakarta_Sans', sans-serif]">
            {/* Header */}
            <header className="bg-sky-900 shadow-md p-6 flex justify-between items-center">
                <Image src={Logo} alt="Logo da Empresa" width={200} height={100} />
                <div className="relative" ref={menuRef}>
                    <button onClick={() => setShowMenu(!showMenu)} className="flex items-center">
                        <MdAccountCircle className="text-white text-3xl" />
                        <span className="text-white ml-2">{user.name}</span>
                    </button>
                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
                            <button
                                onClick={handleLogoff}
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                            >
                                Sair
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Corpo */}
            <div className="flex">
                {/* Menu lateral */}
                <aside className="w-60 bg-gray-200 min-h-screen p-4">
                    <nav className="flex flex-col space-y-2">
                        <button
                            onClick={() => setModalOpen(true)}
                            className="text-left py-2 border-b border-gray-400 text-sky-900 hover:font-semibold transition"
                        >
                            Adicionar Arquivo
                        </button>
                        <button
                            onClick={() => setPropertyModalOpen(true)} // Abre o modal de adicionar imóvel
                            className="text-left py-2 border-b border-gray-400 text-sky-900 hover:font-semibold transition"
                        >
                            Adicionar Imóvel
                        </button>
                        <Link href="/dashboard" className="text-left py-2 border-b border-gray-400 text-sky-900 hover:font-semibold transition">
                            Dashboard
                        </Link>
                        <button className="text-left py-2 border-b border-gray-400 text-sky-900 hover:font-semibold transition">
                            Gerar Relatório
                        </button>
                        <button className="text-left py-2 border-b border-gray-400 text-sky-900 hover:font-semibold transition">
                            Ajuda
                        </button>
                    </nav>
                </aside>

                {/* Conteúdo principal */}
                <main className="flex-1 p-6 flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                        <h1 className="text-3xl text-center font-semibold text-sky-900 mb-6">Meus Arquivos</h1>

                        {/* Modais */}
                        {isModalOpen && (
                            <AddFileModal
                                onAddFile={addFile}
                                onClose={() => setModalOpen(false)}
                            />
                        )}
                        {isPropertyModalOpen && (
                            <AddPropertyModal
                                onClose={() => setPropertyModalOpen(false)} // Fechar o modal de adicionar imóvel
                                onAddProperty={() => {
                                    // Ação de adicionar imóvel pode ser vazia se não for necessária
                                    console.log("Imóvel adicionado!");
                                }}
                            />
                        )}

                        {/* Conteúdo */}
                        {files.length === 0 ? (
                            <div className="flex flex-col items-center mt-10">
                                <Image
                                    src={ArquivoNaoEncontrado}
                                    alt="Nenhum arquivo encontrado"
                                    width={200}
                                    height={200}
                                    className="mb-4"
                                />
                                <p className="text-gray-500">Nenhum arquivo encontrado. Adicione um arquivo.</p>
                            </div>
                        ) : (
                            <div className="mt-4 bg-[#f3f6f8] shadow-md rounded-lg p-4 overflow-x-auto">
                                <table className="w-full text-left border-collapse text-zinc-800">
                                    <thead>
                                        <tr>
                                            <th className="border-b p-2">Título</th>
                                            <th className="border-b p-2">Valor</th>
                                            <th className="border-b p-2">Data da Compra</th>
                                            <th className="border-b p-2">Imóvel</th>
                                            <th className="border-b p-2">Categoria</th>
                                            <th className="border-b p-2">Subcategoria</th>
                                            <th className="border-b p-2">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentFiles.map((file, index) => (
                                            <tr key={index} className="hover:bg-gray-100">
                                                <td className="border-b p-2">{file.title}</td>
                                                <td className="border-b p-2">R$ {file.value?.toFixed(2)}</td>
                                                <td className="border-b p-2">{file.purchaseDate}</td>
                                                <td className="border-b p-2">{file.property}</td>
                                                <td className="border-b p-2">{file.category}</td>
                                                <td className="border-b p-2">{file.subcategory}</td>
                                                <td className="border-b p-2">
                                                    <button
                                                        onClick={() => deleteFile(index)}
                                                        className="text-red-600 hover:text-red-800 ml-3"
                                                    >
                                                        <IoTrashBinSharp size={20} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Paginação */}
                                <div className="flex justify-center mt-4">
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-l-md hover:bg-gray-400"
                                    >
                                        Anterior
                                    </button>
                                    <span className="px-4 py-2 text-gray-700">
                                        Página {currentPage}
                                    </span>
                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage * filesPerPage >= files.length}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-r-md hover:bg-gray-400"
                                    >
                                        Próximo
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UploadsPage;
