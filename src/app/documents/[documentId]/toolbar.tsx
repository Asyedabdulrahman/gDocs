"use client";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";
import { BoldIcon, ChevronDownIcon, HighlighterIcon, ImageIcon, ItalicIcon, Link2Icon, ListTodoIcon, LucideIcon, MessageSquarePlus, PrinterIcon, Redo2Icon, RemoveFormattingIcon, SearchIcon, SpellCheckIcon, UnderlineIcon, Undo2Icon, UploadIcon, AlignCenterIcon, AlignRightIcon, AlignLeftIcon, AlignJustifyIcon, ListIcon, ListOrderedIcon, MinusIcon, PlusIcon, ListCollapseIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { type Level } from "@tiptap/extension-heading"
import { type ColorResult, SketchPicker } from "react-color";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";


const FontSizeButton = () => {
    const { editor } = useEditorStore();

    const currentFontSize = editor?.getAttributes("textStyle").fontSize ? editor?.getAttributes("textStyle").fontSize.replace("px", "") : "16";

    const [fontSize, setfontSize] = useState(currentFontSize);
    const [inputValue, SetInputValue] = useState(fontSize);
    const [isEditing, setIsEditing] = useState(false);

    const updateFontSize = (newSize: string) => {
        const size = parseInt(newSize);
        if (!isNaN(size) && size > 0) {
            editor?.chain().focus().setFontSize(`${size}px`).run();
            setfontSize(newSize);
            SetInputValue(newSize);
            setIsEditing(false);
        }
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        SetInputValue(e.target.value);
    }

    const handleInputBlur = () => {
        updateFontSize(inputValue);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            updateFontSize(inputValue);
            editor?.commands.focus();
        }
    };

    const increment = () => {
        const newsize = parseInt(fontSize) + 1;
        updateFontSize(newsize.toString());
    }

    const decrement = () => {
        const newsize = parseInt(fontSize) - 1;
        if (newsize > 0) {
            updateFontSize(newsize.toString());
        }
    }


    return (
        <div className="flex items-center gap-x-1">
            <button onClick={decrement} className="h-7 w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80">
                <MinusIcon className="size-4" />
            </button>
            {isEditing ? (
                <input type="text" value={inputValue} onChange={handleInputChange} onBlur={handleInputBlur} onKeyDown={handleKeyDown} className="h-7 w-7 text-sm border border-neutral-400 text-center rounded-sm  bg-transparent focus:outline-none focus:ring-0" />
            ) :
                (
                    <button onClick={() => {
                        setIsEditing(true);
                        setfontSize(currentFontSize);
                    }} className="h-7 w-7 text-sm border border-neutral-400 text-center rounded-sm bg-transparent cursor-text">
                        {currentFontSize}
                    </button>
                )
            }
            <button onClick={increment} className="h-7 w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80">
                <PlusIcon className="size-4" />
            </button>
        </div>
    )
}

const ListButton = () => {
    const { editor } = useEditorStore();

    const lists = [
        {
            label: "Bullet List",
            icon: ListIcon,
            isActive: () => editor?.isActive("bulletList"),
            onClick: () => editor?.chain().focus().toggleBulletList().run(),
        },
        {
            label: "Ordered List",
            icon: ListOrderedIcon,
            isActive: () => editor?.isActive("orderedList"),
            onClick: () => editor?.chain().focus().toggleOrderedList().run(),
        }
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80" aria-label="Toggle list options">
                    <ListIcon className="h-4 w-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-1 flex flex-col gap-y-2">
                {lists.map(({ label, icon: Icon, isActive, onClick }) => (
                    <button key={label} onClick={(e) => { e.stopPropagation(); onClick(); }} className={cn("flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80", isActive() && "bg-neutral-200/80")}>
                        <Icon className="size-4" />
                        <span className="text-sm">{label}</span>
                    </button>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const AlignButton = () => {
    const { editor } = useEditorStore();

    const alignments = [
        {
            label: "Align center",
            value: "center",
            icon: AlignCenterIcon
        },
        {
            label: "Align left",
            value: "left",
            icon: AlignLeftIcon
        }, {
            label: "Align right",
            value: "right",
            icon: AlignRightIcon
        }, {
            label: "Align justify",
            value: "justify",
            icon: AlignJustifyIcon
        },
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80">
                    <AlignLeftIcon className="h-4 w-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-1 flex flex-col gap-y-2">
                {alignments.map(({ label, value, icon: Icon }) => (
                    <button key={value} onClick={() => editor?.chain().focus().setTextAlign(value).run()} className={cn("flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
                        editor?.isActive({ TextAlign: value }) && "bg-neutral-200/80"
                    )} >
                        <Icon className="size-4" />
                        <span className="text-sm">{label}</span>
                    </button>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const ImageButton = () => {
    const { editor } = useEditorStore();
    const [isDialogOpen, setisDialogOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const onChange = (src: string) => {
        editor?.chain().focus().setImage({ src }).run();
    }

    const onUpload = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const imageUrl = URL.createObjectURL(file);
                onChange(imageUrl);
            }
        }
        input.click();
    };

    const handleImageUrlSubmit = () => {
        if (imageUrl) {
            onChange(imageUrl);
            setImageUrl("");
            setisDialogOpen(false);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80">
                        <ImageIcon className="h-4 w-4" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-2.5 flex items-center gap-x-2">
                    <DropdownMenuItem onClick={onUpload}>
                        <UploadIcon className="size-4 mr-2" />
                        Upload
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setisDialogOpen(true)}>
                        <SearchIcon className="size-4 mr-2" />
                        Paste image url
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isDialogOpen} onOpenChange={setisDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Insert image URL</DialogTitle>
                    </DialogHeader>
                    <Input placeholder="Insert image url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleImageUrlSubmit();
                        }
                    }} />
                    <DialogFooter>
                        <Button onClick={handleImageUrlSubmit}>
                            Insert
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}


const LinkButton = () => {
    const { editor } = useEditorStore();
    const [value, setValue] = useState("");

    const onChange = (href: string) => {
        editor?.chain().focus().extendMarkRange("link").setLink({ href }).run();
        setValue("");
    }
    return (
        <DropdownMenu onOpenChange={(open) => {
            if (open) {
                setValue(editor?.getAttributes("link").href || "");
            }
        }}>
            <DropdownMenuTrigger asChild>
                <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80">
                    <Link2Icon className="h-4 w-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-4 items-center justify-center flex flex-row gap-2 m-2">
                <Input placeholder="https://example.com" value={value} onChange={(e) => setValue(e.target.value)} />
                <Button onClick={() => onChange(value)}>
                    Apply
                </Button>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}



const HighlightColorButton = () => {
    const { editor } = useEditorStore();

    const value = editor?.getAttributes("highlight").color || "#FFFFFF"

    const onChange = (color: ColorResult) => {
        editor?.chain().focus().setHighlight({ color: color.hex }).run();
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80">
                    <HighlighterIcon className="h-4 w-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-0">
                <SketchPicker color={value} onChange={onChange} />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const TextColorButton = () => {
    const { editor } = useEditorStore();

    const value = editor?.getAttributes("textStyle").color || "#F1F4F9";

    const onChange = (color: ColorResult) => {
        editor?.chain().focus().setColor(color.hex).run();
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80">
                    <span className="text-sm ">A</span>
                    <div className="h-0.5 w-full" style={{ backgroundColor: value }} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-0">
                <SketchPicker color={value} onChange={onChange} />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const HeadingLevelButton = () => {
    const { editor } = useEditorStore();
    const headings = [
        { label: "Heading 1", value: 1, fontSize: "32px" },
        { label: "Heading 2", value: 2, fontSize: "24px" },
        { label: "Heading 3", value: 3, fontSize: "20px" },
        { label: "Heading 4", value: 4, fontSize: "18px" },
        { label: "Heading 5", value: 5, fontSize: "16px" },
    ];


    const getCurrentHeading = () => {
        for (let level = 1; level <= 5; level++) {
            if (editor?.isActive("heading", { level })) {
                {
                    return `Heading ${level}`;
                }
            }
        }
        return "Normal Text";
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-7 w-[120px] shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80">
                    <span className="truncate">
                        {getCurrentHeading()}
                    </span>
                    <ChevronDownIcon className="ml-2 size-4 shrink-0" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {headings.map(({ label, value, fontSize }) => (
                    <button key={label} className={cn(
                        "flex items-center gap-x-2 px-2 py-2 rounded-sm hover:bg-neutral-200/80",
                        (value === 0 && !editor?.isActive("heading")) ||
                        (value !== 0 && editor?.isActive("heading", { level: value })) && "bg-neutral-200/80")} style={{ fontSize }}
                        onClick={() => {
                            if (value === 0) {
                                editor?.chain().focus().setParagraph().run();
                            }
                            else {
                                editor?.chain().focus().toggleHeading({ level: value as Level }).run();
                            }
                        }}>
                        <span className="text-sm" style={{ fontSize }}>{label}</span>
                    </button>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
};



const FontFamilyButton = () => {
    const { editor } = useEditorStore();
    const fonts = [
        { label: "Arial", value: "Arial" },
        { label: "Times New Roman", value: "Times New Roman" },
        { label: "Courier New", value: "Courier New" },
        { label: "Georgia", value: "Georgia" },
        { label: "Verdana", value: "Verdana" },
        { label: "Comic Sans MS", value: "Comic Sans MS" },
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-7 w-[120px] shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80">
                    <span className="truncate">
                        {editor?.getAttributes("textStyle")?.fontFamily ?? "Arial"}
                    </span>
                    <ChevronDownIcon className="ml-2 size-4 shrink-0" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col p-1 gap-y-1">
                {fonts.map(({ label, value }) => (
                    <button onClick={() => editor?.chain().focus().setFontFamily(value).run()} key={value} className={cn("flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
                        editor?.getAttributes("textStyle").fontFamily === value && "bg-neutral-200/80"
                    )} style={{ fontFamily: value }}>
                        <span className="text-sm">{label}</span>
                    </button>
                ))}

            </DropdownMenuContent>
        </DropdownMenu >
    )
}



interface ToolbarButtonProps {
    onClick: () => void;
    isActive: boolean;
    icon: LucideIcon
}


const ToolbarButton = ({
    onClick,
    isActive,
    icon: Icon,
}: ToolbarButtonProps) => {
    return (
        <button onClick={onClick} className={cn(
            "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80",
            isActive && "bg-black  text-white"
        )}>
            <Icon className="size-4" />
        </button>
    )
}


const Toolbar = () => {
    const { editor } = useEditorStore();
    // console.log(editor);

    interface ToolbarItem {
        label: string;
        icon: LucideIcon;
        onClick: () => void;
        isActive?: boolean;
    }

    const sections: ToolbarItem[][] = [
        [
            {
                label: "undo",
                icon: Undo2Icon,
                onClick: () => editor?.chain().focus().undo().run(),
            },
            {
                label: "redo",
                icon: Redo2Icon,
                onClick: () => editor?.chain().focus().redo().run(),
            },
            {
                label: "print",
                icon: PrinterIcon,
                onClick: () => window.print(),
            },
            {
                label: "spell check",
                icon: SpellCheckIcon,
                onClick: () => {
                    const current = editor?.view.dom.getAttribute("spellcheck");
                    editor?.view.dom.setAttribute("spellcheck", current === "false" ? "true" : "false")
                }
            }
        ],
        //first array 
        [
            {
                label: "Bold",
                icon: BoldIcon,
                isActive: editor?.isActive("bold"),
                onClick: () => {
                    editor?.chain().focus().toggleBold().run();
                },
            }, {
                label: "Italic",
                icon: ItalicIcon,
                isActive: editor?.isActive("italic"),
                onClick: () => {
                    editor?.chain().focus().toggleItalic().run();
                },
            },
            {
                label: "Underline",
                icon: UnderlineIcon,
                isActive: editor?.isActive("underline"),
                onClick: () => {
                    editor?.chain().focus().toggleUnderline().run();
                },
            }
        ],
        //second array 
        [
            {
                label: "Comment",
                icon: MessageSquarePlus,
                onClick: () => console.log("todo clicked"),
                isActive: false, //enable the functionality
            },
            {
                label: "List Todo",
                icon: ListTodoIcon,
                onClick: () => editor?.chain().focus().toggleTaskList().run(),
                isActive: editor?.isActive("taskList"), //enable the functionality
            }, {
                label: "Remove Formatting",
                icon: RemoveFormattingIcon,
                onClick: () => editor?.chain().focus().unsetAllMarks().run(),

            },

        ]
    ];


    return (
        <div className="bg-[#F1F4F9] px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex items-center gap-x-0.5 overflow-x-auto">
            {/* First Array */}
            {sections[0].map((item) => (
                <ToolbarButton key={item.label} {...item} isActive={item.isActive ?? false} />
            ))}

            <Separator orientation="vertical" className="h-6 bg-neutral-300" />
            <FontFamilyButton />
            <HeadingLevelButton />
            <FontSizeButton />
            <Separator orientation="vertical" className="h-6 bg-neutral-300" />

            {/* second Array */}

            {
                sections[1].map((item) => (
                    <ToolbarButton key={item.label} {...item} isActive={item.isActive ?? false} />
                ))
            }

            {/* //third array */}

            <TextColorButton />
            <HighlightColorButton />
            <Separator orientation="vertical" className="h-6 bg-neutral-300" />
            <LinkButton />
            <ImageButton />
            <AlignButton />
            <ListButton />
            {
                sections[2].map((item) => (
                    <ToolbarButton key={item.label} {...item} isActive={item.isActive ?? false} />
                ))
            }
        </div>
    )
}

export default Toolbar; 