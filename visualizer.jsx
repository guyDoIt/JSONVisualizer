{\rtf1\ansi\ansicpg1252\cocoartf2821
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import React, \{ useState, useEffect \} from "react";\
import \{ ChevronRight, Code2, CalendarDays, Type, Plus, ToggleRight, X, ChevronsUpDown \} from "lucide-react";\
import clsx from "clsx";\
\
const JsonVisualizer = () => \{\
  const [jsonInput, setJsonInput] = useState(`\{\
  "Name": "Acme Corporation",\
  "Industry": "Technology",\
  "Phone": "123-456-7890",\
  "Website": "https://acme.com",\
  "Addresses": [\
    \{\
      "Type": "Billing",\
      "Street": "123 Main St",\
      "City": "San Francisco",\
      "State": "CA",\
      "PostalCode": "94105",\
      "Country": "USA"\
    \},\
    \{\
      "Type": "Shipping",\
      "Street": "456 Market St",\
      "City": "San Francisco",\
      "State": "CA",\
      "PostalCode": "94107",\
      "Country": "USA"\
    \}\
  ],\
  "AccountDetails": \{\
    "Owner": \{\
      "User": \{\
        "Contact": \{\
          "Preferences": \{\
            "Notifications": \{\
              "Email": true,\
              "SMS": false,\
              "Frequency": "Daily"\
            \},\
            "Language": "en-US"\
          \},\
          "Email": "owner@acme.com",\
          "Phone": "321-654-0987"\
        \},\
        "Username": "jdoe",\
        "Active": true\
      \},\
      "Region": "North America"\
    \},\
    "CreatedDate": "2025-03-24T10:00:00Z"\
  \}\
\}`);\
\
  const [searchTerm, setSearchTerm] = useState("");\
  const [expandedNodes, setExpandedNodes] = useState(\{\});\
  const [parsedJson, setParsedJson] = useState(null);\
  const [collapseAll, setCollapseAll] = useState(true);\
\
  useEffect(() => \{\
    document.body.classList.add("overflow-hidden");\
    return () => document.body.classList.remove("overflow-hidden");\
  \}, []);\
\
  const sanitizeQuotes = (text) => text.replace(/[\'93\'94]/g, '"').replace(/[\'91\'92]/g, "'");\
\
  useEffect(() => \{\
    try \{\
      const cleaned = sanitizeQuotes(jsonInput);\
      setParsedJson(JSON.parse(cleaned));\
    \} catch \{\
      setParsedJson(null);\
    \}\
  \}, [jsonInput]);\
\
  const isExpanded = (path, isArray = false) => \{\
    if (path in expandedNodes) return expandedNodes[path];\
    return !isArray;\
  \};\
\
  const toggleNode = (path, isArray = false) => \{\
    setExpandedNodes((prev) => (\{\
      ...prev,\
      [path]: !isExpanded(path, isArray),\
    \}));\
  \};\
\
  const toggleAllNodes = (expand = true) => \{\
    const collectPaths = (obj, basePath = "") => \{\
      let paths = \{\};\
      if (typeof obj === "object" && obj !== null) \{\
        for (const key in obj) \{\
          const fullPath = basePath ? `$\{basePath\}.$\{key\}` : key;\
          paths[fullPath] = expand;\
          const child = obj[key];\
          if (typeof child === "object" && child !== null) \{\
            Object.assign(paths, collectPaths(child, fullPath));\
          \}\
        \}\
      \}\
      return paths;\
    \};\
    const newState = collectPaths(parsedJson);\
    setExpandedNodes(newState);\
    setCollapseAll(!expand);\
  \};\
\
  const deepEmptyCopy = (obj) => \{\
    if (Array.isArray(obj)) return obj.map(deepEmptyCopy);\
    if (typeof obj === 'object' && obj !== null) \{\
      const result = \{\};\
      for (const key in obj) result[key] = deepEmptyCopy("");\
      return result;\
    \}\
    return "";\
  \};\
\
  const handleAddArrayItem = (path) => \{\
    const keys = path.split(".");\
    const cleaned = sanitizeQuotes(jsonInput);\
    const root = JSON.parse(cleaned);\
    let ref = root;\
    for (let i = 0; i < keys.length; i++) ref = ref[keys[i]];\
    if (Array.isArray(ref)) \{\
      const last = ref[ref.length - 1];\
      ref.push(deepEmptyCopy(last));\
    \}\
    setJsonInput(JSON.stringify(root, null, 2));\
  \};\
\
  const highlight = (text) => \{\
    if (!searchTerm) return text;\
    const regex = new RegExp(`($\{searchTerm\})`, "gi");\
    return String(text).split(regex).map((part, i) =>\
      regex.test(part) ? <mark key=\{i\} className="bg-yellow-200 px-1 rounded">\{part\}</mark> : part\
    );\
  \};\
\
  const matchesSearch = (key, val) => \{\
    if (!searchTerm) return true;\
    const flatVal = typeof val === "string" || typeof val === "number" || typeof val === "boolean" ? String(val) : "";\
    return key.toLowerCase().includes(searchTerm.toLowerCase()) || flatVal.toLowerCase().includes(searchTerm.toLowerCase());\
  \};\
\
  const filterStructure = (obj) => \{\
    if (typeof obj !== 'object' || obj === null) return null;\
    if (Array.isArray(obj)) \{\
      const filtered = obj\
        .map((item) => filterStructure(item))\
        .filter((val) => val && Object.keys(val).length > 0);\
      return filtered.length > 0 ? filtered : null;\
    \} else \{\
      const result = \{\};\
      for (const key in obj) \{\
        const child = obj[key];\
        const filteredChild = filterStructure(child);\
        if (matchesSearch(key, child) || filteredChild) \{\
          result[key] = filteredChild ?? child;\
        \}\
      \}\
      return Object.keys(result).length > 0 ? result : null;\
    \}\
  \};\
\
  const renderValue = (value, path, label = null, isTopLevel = false) => \{\
    const inputColor = '#606D77';\
\
    if (typeof value === "object" && value !== null) \{\
      const isArray = Array.isArray(value);\
      const expanded = isExpanded(path, isArray);\
      return (\
        <div className=\{clsx("ml-[10px] group relative", isTopLevel && "hover:bg-gray-50 rounded")\}> \{/* hover effect */\}\
          <div className="flex items-center justify-between">\
            <div className="flex items-center gap-1 cursor-pointer" onClick=\{() => toggleNode(path, isArray)\}>\
              <ChevronRight className=\{clsx("transition-transform", expanded && "rotate-90")\} size=\{14\} />\
              \{label && (\
                <div className="font-semibold text-sm" style=\{\{ color: inputColor \}\}>\
                  \{highlight(label)\}\{isArray ? ` [$\{value.length\}]` : ""\}\
                </div>\
              )\}\
            </div>\
            \{isTopLevel && (\
              <Code2 size=\{14\} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity mr-2" />\
            )\}\
            \{isArray && (\
              <button\
                className="opacity-0 group-hover:opacity-100 transition-opacity"\
                onClick=\{() => handleAddArrayItem(path)\}\
                title="Add item"\
              >\
                <Plus size=\{14\} className="text-blue-600 hover:text-blue-800" />\
              </button>\
            )\}\
          </div>\
          \{expanded && (\
            <div className="ml-[10px] border-l border-gray-300 pl-2">\
              \{Object.entries(value).map(([key, val], idx) => (\
                <div key=\{key + idx\} className="mb-1">\
                  \{renderValue(val, `$\{path\}.$\{key\}`, key)\}\
                </div>\
              ))\}\
            </div>\
          )\}\
        </div>\
      );\
    \} else \{\
      return (\
        <div className="flex flex-col gap-1">\
          \{label && <div className="font-semibold text-sm" style=\{\{ color: inputColor \}\}>\{highlight(label)\}</div>\}\
          <div className="flex items-center border rounded px-2 py-1 text-sm w-full">\
            \{typeof value === "boolean" ? (\
              <ToggleRight size=\{14\} className="text-gray-500 mr-2" />\
            ) : (\
              <Type size=\{14\} className="text-gray-500 mr-2" />\
            )\}\
            <div className="flex-1 text-sm outline-none bg-transparent" style=\{\{ color: inputColor \}\}>\
              \{highlight(String(value))\}\
            </div>\
            <Code2 size=\{14\} className="text-gray-400 ml-2" />\
          </div>\
        </div>\
      );\
    \}\
  \};\
\
  const filteredJson = searchTerm && parsedJson ? filterStructure(parsedJson) : parsedJson;\
\
  return (\
    <div className="grid grid-cols-2 gap-4 h-screen p-4 box-border">\
      <div className="p-4 h-full overflow-auto flex flex-col">\
        <div className="flex justify-between items-center mb-2">\
          <h2 className="font-bold">JSON Input</h2>\
        </div>\
        <textarea\
          className="w-full flex-1 p-2 border rounded font-mono text-sm resize-none"\
          value=\{jsonInput\}\
          onChange=\{(e) => setJsonInput(e.target.value)\}\
        />\
      </div>\
      <div className="p-4 h-full overflow-auto flex flex-col">\
        <div className="flex justify-between items-center mb-2">\
          <h2 className="font-bold">Visualization</h2>\
          <div className="flex items-center gap-2 w-[130%] max-w-[420px]">\
            <div className="relative flex-1">\
              <input\
                placeholder="Search JSON..."\
                value=\{searchTerm\}\
                onChange=\{(e) => setSearchTerm(e.target.value)\}\
                className="text-sm border px-2 py-1 pr-6 rounded w-full h-[32px]"\
              />\
              \{searchTerm && (\
                <X\
                  className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"\
                  size=\{14\}\
                  onClick=\{() => setSearchTerm("")\}\
                />\
              )\}\
            </div>\
            <button\
              className="border rounded px-2 h-[32px] flex items-center justify-center"\
              title="Expand/Collapse All"\
              onClick=\{() => toggleAllNodes(collapseAll)\}\
            >\
              <ChevronsUpDown size=\{14\} className="text-gray-500" />\
            </button>\
            <button className="border rounded px-2 h-[32px] flex items-center justify-center">\
              <Code2 size=\{14\} className="text-gray-500" />\
            </button>\
          </div>\
        </div>\
        <div className="text-sm flex-1 overflow-auto">\
          \{filteredJson ? Object.entries(filteredJson).map(([key, value]) => (\
            <div key=\{key\} className="mb-2">\
              \{renderValue(value, key, key, true)\}\
            </div>\
          )) : <div className="text-red-500">No results or invalid JSON</div>\}\
        </div>\
      </div>\
    </div>\
  );\
\};\
\
export default JsonVisualizer;\
}
