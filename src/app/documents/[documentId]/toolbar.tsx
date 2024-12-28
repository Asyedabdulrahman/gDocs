"use client";

import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";
import { BoldIcon, ChevronDownIcon, HighlighterIcon, ItalicIcon, ListTodoIcon, LucideIcon, MessageSquarePlus, PrinterIcon, Redo2Icon, RemoveFormattingIcon, SpellCheckIcon, UnderlineIcon, Undo2Icon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { type Level } from "@tiptap/extension-heading"
import { type ColorResult, SketchPicker } from "react-color";

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
            <TextColorButton />
            <HighlightColorButton />

            {/* second Array */}
            {
                sections[1].map((item) => (
                    <ToolbarButton key={item.label} {...item} isActive={item.isActive ?? false} />
                ))
            }
            <Separator orientation="vertical" className="h-6 bg-neutral-300" />
            {/* //third array */}
            {
                sections[2].map((item) => (
                    <ToolbarButton key={item.label} {...item} isActive={item.isActive ?? false} />
                ))
            }
        </div>
    )
}

export default Toolbar; 