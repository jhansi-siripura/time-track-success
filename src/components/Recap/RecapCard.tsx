// Updated version of RecapCard.tsx focusing on minimal header and subtle metadata

<Card className="hover:shadow-md transition-shadow duration-200">
  {/* ░░ HEADER  ░░ */}
  <div className="px-4 pt-4 pb-2 flex justify-end">
    <div className="flex gap-2">
      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setIsEditing(true)}>
        <Pencil className="h-4 w-4 text-gray-400" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? 'Collapse' : 'Expand'}
      >
        {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </Button>
    </div>
  </div>

  {/* ░░ BODY ░░ */}
  {isExpanded && (
    <CardContent className="bg-white px-6 pb-4 pt-0 space-y-5">
      {log.notes && (
        <div
          className="prose prose-sm max-w-none text-gray-800"
          dangerouslySetInnerHTML={{ __html: log.notes }}
          style={{ lineHeight: '1.7' }}
        />
      )}

      {log.images && log.images.length > 0 && (
        <div className="pt-4 border-t border-gray-100">
          <div className="mb-2 text-xs text-gray-500">Attachments ({log.images.length})</div>
          <div className={`grid ${getImageGridLayout(log.images.length)} gap-2 w-fit`}>
            {log.images.map((src, i) => (
              <div
                key={i}
                className="group relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200"
                onClick={() => handleImageClick(i)}
              >
                <img
                  src={src}
                  alt={`log-img-${i}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'fallback.png';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ░░ FOOTER META ░░ */}
      <div className="pt-3 border-t border-gray-100 text-[10px] text-gray-400 flex flex-wrap justify-between items-center">
        <div className="flex gap-2">
          <Badge className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 border border-gray-200">
            {log.subject}
          </Badge>
          {log.topic && (
            <Badge className="text-[10px] px-2 py-0.5 bg-gray-50 text-gray-500 border border-gray-100">
              {log.topic}
            </Badge>
          )}
        </div>
        <div className="text-[9px] text-gray-300">
          {formatDateTime(log.date, log.time)}
        </div>
      </div>
    </CardContent>
  )}
</Card>
