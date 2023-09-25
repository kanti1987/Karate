/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Copyright (C) Paul Johnston 1999 - 2000.
 * Updated by Greg Holt 2000 - 2001.
 * See http://pajhome.org.uk/site/legal.html for details.
 */

/*
 * Convert a 32-bit number to a hex string with ls-byte first
 */
var hex_chr = "0123456789abcdef";
function rhex(num)
{
  str = "";
  for(j = 0; j <= 3; j++)
    str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) +
           hex_chr.charAt((num >> (j * 8)) & 0x0F);
  return str;
}

/*
 * Convert a string to a sequence of 16-word blocks, stored as an array.
 * Append padding bits and the length, as described in the MD5 standard.
 */
function str2blks_MD5(str)
{
  nblk = ((str.length + 8) >> 6) + 1;
  blks = new Array(nblk * 16);
  for(i = 0; i < nblk * 16; i++) blks[i] = 0;
  for(i = 0; i < str.length; i++)
    blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
  blks[i >> 2] |= 0x80 << ((i % 4) * 8);
  blks[nblk * 16 - 2] = str.length * 8;
  return blks;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left
 */
function rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * These functions implement the basic operation for each round of the
 * algorithm.
 */
function cmn(q, a, b, x, s, t)
{
  return add(rol(add(add(a, q), add(x, t)), s), b);
}
function ff(a, b, c, d, x, s, t)
{
  return cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function gg(a, b, c, d, x, s, t)
{
  return cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function hh(a, b, c, d, x, s, t)
{
  return cmn(b ^ c ^ d, a, b, x, s, t);
}
function ii(a, b, c, d, x, s, t)
{
  return cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Take a string and return the hex representation of its MD5.
 */
function calcMD5(str)
{
  x = str2blks_MD5(str);
  a =  1732584193;
  b = -271733879;
  c = -1732584194;
  d =  271733878;

  for(i = 0; i < x.length; i += 16)
  {
    olda = a;
    oldb = b;
    oldc = c;
    oldd = d;

    a = ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = ff(c, d, a, b, x[i+10], 17, -42063);
    b = ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = ff(d, a, b, c, x[i+13], 12, -40341101);
    c = ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = gg(c, d, a, b, x[i+11], 14,  643717713);
    b = gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = gg(c, d, a, b, x[i+15], 14, -660478335);
    b = gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = hh(b, c, d, a, x[i+14], 23, -35309556);
    a = hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = hh(d, a, b, c, x[i+12], 11, -421815835);
    c = hh(c, d, a, b, x[i+15], 16,  530742520);
    b = hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = ii(c, d, a, b, x[i+10], 15, -1051523);
    b = ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = ii(d, a, b, c, x[i+15], 10, -30611744);
    c = ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = add(a, olda);
    b = add(b, oldb);
    c = add(c, oldc);
    d = add(d, oldd);
  }
  return rhex(a) + rhex(b) + rhex(c) + rhex(d);
}


//***********************************************************************************************************************
//   Tim Qian & PDChen: New Chrome Extension (JS) for Block Mode support.
//***********************************************************************************************************************
const DSE_BASE_URL = "http://127.0.0.1:55296/ChromeExt/"
var cpsResultAnswer = "ALLOW";
var chromeExtensionON = false;
var MOMode = false;
var F1EWebsiteVisitedEnabled = false;

var wsResultMapCache = {};
var mySessionID = new Date().getTime().toString(16); // Number of milliseconds since unix epoch as a hex string.
const uninitializedSidSessionID = -1;
var sidSessionID = uninitializedSidSessionID; // While uninitialzed, try to get a real Session ID.

// request body (set in callback before request is made) used to match the request body with the request id
var request_map_cache = {};

function trimCache()
{
    // UEP-31700. Occasionally, while thrashing after a cancel, google will slip us a modified
    // version of the same message. So increase the timeout a bit to still have that occasional
    // hash value in the cache.
	var maxTimeInCache = 180000.0;
	var currentTime = 0;
	var diff = 0;
	currentTime = new Date().getTime();
	for(var key in wsResultMapCache)
	{
		diff = currentTime - wsResultMapCache[key];
		if(diff > maxTimeInCache)
		{
			//console.log("Deleting: " + key + "TS: " + formatTime(wsResultMapCache[key]) + " CT: " + formatTime(currentTime));
			delete wsResultMapCache[key];
		}
	}
}

function get_request_body(requestId)
{
	var requestBody = null;
	if(requestId in request_map_cache)
	{
		requestBody = request_map_cache[requestId];
		delete request_map_cache[requestId];
	}

	if(Object.keys(request_map_cache).length > 10)
	{
		var lower_bound = Number(requestId) - 4;
		for(var key in request_map_cache)
		{
			if(Number(key) < lower_bound)
			{
				delete request_map_cache[key];
			}
		}
		if(Object.keys(request_map_cache).length > 10)
		{
			//console.log("Request map cache exceeded limit of 10 requests! dumping cache...");
			for(var key in request_map_cache)
				delete request_map_cache[key];
		}
	}
	return requestBody;
}

function remove_request_from_cache(requestId)
{
	if(requestId in request_map_cache)
	{
		delete request_map_cache[requestId];
	}
}

//***********************************************************************************************************************
function chromeExtServiceCheck() {
    var myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function() {
        if (myRequest.readyState == 4) {
            if (myRequest.status == 200) {
				if(myRequest.responseText.indexOf("DISCHR") != -1)
				{
					chromeExtensionON = false;
				}
				else
				{
					if(myRequest.responseText.indexOf("MOMOMO") != -1)
            		{
            			MOMode = true;
               		}
                	else
                	{
                		MOMode = false;
                	}
					if(myRequest.responseText.indexOf("GET") != -1)
					{
						F1EWebsiteVisitedEnabled = true;
					}
					else
					{
						F1EWebsiteVisitedEnabled = false;
					}
					chromeExtensionON = true;  //OK "HELLOW", turn ON Chrome Extension
				}
            }
            else if (myRequest.status == 0 ||     	//Service is DOWN
		     myRequest.status == 500) {	  	//Web Channel of OFF, turn off Chrome Extension
                chromeExtensionON = false;
            }
            else {
                chromeExtensionON = true;
                console.log("GET response ERROR code: " + myRequest.status);
            }

        }
    };

    // UEP-36250. Put the user's session ID in the mySessionID variable as a deterministic way to identify the user.
    if(sidSessionID == uninitializedSidSessionID)
    {
        // This is asynchronous. mySessionID will be populated in the onSidResponse() callback.
        getSidForUser();
    }

    // We were always using chrome.runtime.id here, but since it is a "GET", the DSE will not
    // process it as a post, so the session number does not matter.
    // See top of CDataSecurityEngine::DseRecvThreadProc().
    myRequest.open("GET", DSE_BASE_URL + chrome.runtime.id, true);
    myRequest.send();
    setTimeout(chromeExtServiceCheck, 15000);
}


function pausecomp(millis){
  var date = new Date();
  var curDate = null;
  do { curDate = new Date(); }
  while(curDate-date < millis);
}

function get_boundary(content_type_header)
{
  const boundary_string_identifier = 'boundary=';
  var return_string = '';
  var boundary_start = content_type_header.search(boundary_string_identifier);
  if (boundary_start != - 1) {
    boundary_start += boundary_string_identifier.length;
    var boundary_end = content_type_header.search('\r\n');
    if (boundary_end == - 1) {
      return_string = content_type_header.substr(boundary_start);
    } else {
      return_string = content_type_header.substr(boundary_start, boundary_end);
    }
	// remove quotes from boundary string
	if(return_string.charAt(0) == '\"')
	{
		return_string = return_string.slice(1, return_string.length - 1);
    }
  }
  return return_string;
}
/*
* expected return value is url-encoded key that points to the filename
*/
function get_query_string(url)
{
	const decode_url_string = "(DecodedUrl=";
	var decoded_url_start = url.lastIndexOf(decode_url_string);
    if(decoded_url_start == -1) return '';
   	decoded_url_start += decode_url_string.length;
    var query_string = url.substring(decoded_url_start, decoded_url_start+3);
    return query_string;
}

/*
* uses sharepoint rest api url-encoded parameters to get the filename for an upload
*/
function get_sharepoint_file_path(uri)
{
	var url = decodeURIComponent(uri);
  	var query_string = get_query_string(url);
	if(query_string == '') {
		return '';
	} else {
		query_string += "=\'";
	}
	// find the file path on the sharepoint server for upload
	var file_name_start = url.indexOf(query_string);
	if (file_name_start != - 1) {
		file_name_start += query_string.length;
		var file_name_end = url.substr(file_name_start).indexOf('\'');
		if (file_name_end == - 1) {
			return url.substr(file_name_start);
		} else {
			return url.substr(file_name_start, file_name_end);
		}
	}
  return '';
}

/*
* UEP-38295 header "filename" is encoded incorrect if the filename contains any non-English characters
* This function takes current value of "filename", encodes it in right way, then replace the original filename
*/
function covert_file_name(str)
{
	var query_string = 'filename=\"';
	var file_name_start = str.indexOf(query_string);
	if (file_name_start != - 1)
	{
		file_name_start += query_string.length;
		var file_name_end = str.substr(file_name_start).indexOf('\"');
		if (file_name_end != - 1)
		{
			var file_name_ori = str.substr(file_name_start, file_name_end);
			var file_name_cvt = decodeURIComponent(escape(file_name_ori));
			file_name_ori = query_string + file_name_ori;
			file_name_cvt = query_string + file_name_cvt;
			return str.replace(file_name_ori, file_name_cvt);
		}
	}
  return str;
}

/*
* for onedrive personal, we expect at least one request which contains the filename in the url
* in these cases, the "{itemId}" will be a file name instead:
* - e.g. for sensitive_file.pdf, the decoded uri path looks like /drives/{driveId}/items/{itemId}:/sensitive_file.pdf:/createUploadSession
* for batch file upload (or folder upload), this rest API is called once for each file
*/
function get_onedrive_personal_file_path(uri)
{
	const file_upload_query_start_string = ":/";
	const file_upload_query_end_string = ":/oneDrive.createUploadSession";
	var url = decodeURIComponent(uri);
	var return_string = '';
		// find the file path on the sharepoint server for upload
	var file_name_end = url.lastIndexOf(file_upload_query_end_string);
	if (file_name_end != - 1) {
		var file_name_start = url.substr(0, file_name_end).lastIndexOf(file_upload_query_start_string);
		if (file_name_start != - 1)
		{
			file_name_start += file_upload_query_start_string.length;
			return_string = url.slice(file_name_start,file_name_end);
		}
	}
	return return_string;
}

/*
* google drive multifile upload will be sent as PUT
*/
function is_google_drive_batch_file_upload(requestHeaders)
{
	for (let hdr_ of requestHeaders)
	{
		if(hdr_.name.toLowerCase() == "x-goog-upload-protocol")
			return true;
	}
	return false;
}

// Does the current point in the method match a marker?
function isMarker(method, index, methodLength, marker)
{
    if(index + marker.length > methodLength)
    {
        return false;
    }

    for(var i = 0; i < marker.length; i++)
    {
        if(marker[i] != method[index++])
        {
            // Bail out as soon as a character does not match.
            // Most of the time, we'll only have to inspect one character.
            return false;
        }
    }

    return true;
}

// Boundary terminators.
function isBoundaryTerminator(term)
{
    return term == '\r' || term == '-' || term == '\"';
}

// Tag terminator.
function isTagTerminator(term)
{
    return term == '\r';
}

// UEP-31700. The boundary markers we pass to the MD5 cache are random, causing us to not get
// the cache hits we want. So replace the random boundary markers with predictable values.
// See https://www.w3.org/Protocols/rfc1341/7_2_Multipart.html
function replaceBoundriesWithHardcodedValue(str)
{
    // We'll be working with arrays of chars, not strings, to avoid punishing the GC.
    const encapsulationBoundary = "\r\n--".split("");
    const boundaryBegin = "boundary=\"".split("");
    const parentsTag = "\"mimeType\":\"text/plain\",\"parents\":".split("");
    const authorizationTag = "authorization: ".split("");

    var SMALL_A = 97;
    var LETTERS_IN_ALPHABET = 26;
    var result = str.split("");
    for(var i = 0; i < result.length; i++)
    {
        // Look for the marker or tag.
        var markerLength = 0;
        var isTerminatorFN = null;
        if(isMarker(result, i, result.length, encapsulationBoundary))
        {
            markerLength = encapsulationBoundary.length;
            isTerminatorFN = isBoundaryTerminator;
        }
        else if(isMarker(result, i, result.length, boundaryBegin))
        {
            markerLength = boundaryBegin.length;
            isTerminatorFN = isBoundaryTerminator;
        }
        else if(isMarker(result, i, result.length, parentsTag))
        {
            markerLength = parentsTag.length;
            isTerminatorFN = isTagTerminator;
        }
        else if(isMarker(result, i, result.length, authorizationTag))
        {
            markerLength = authorizationTag.length;
            isTerminatorFN = isTagTerminator;
        }

        if(markerLength > 0) // Are we on the beginning of a marker (or tag)?
        {
            // Replace the marker (or tag) with a predictable value.
            var k = 0;
            for(var j = i + markerLength; j < result.length && !isTerminatorFN(result[j]); j++)
            {
                result[j] = String.fromCharCode(SMALL_A + k);
                if(++k >= LETTERS_IN_ALPHABET)
                {
                    k = 0; // Wrap around.
                }
            }

            i = j - 1; // Skip to the end of this line.
        }
    }

    return result.join("");
}

// UEP-33245. We need just the base64 content and filenames for google drive uploads.
// Return each base64 packet and filename as a pair. This way, the hash values will be consistent so we
// can get reliable hits on the MD5 cache. Prevents continous popups from Google
// drive continuing to thrash us even after user cancels the uploads.
function getGoogleDriveBase64Contents(str)
{
    const contentTagName = "\r\ncontent-type: application/json; charset=UTF-8";
    const fileNamePreamble = "\r\n{\"title\":\""; // JSON. Looking for {"title":"
    const fileNameEndMarker = "\"";
    const base64TagName = "\r\ncontent-transfer-encoding: base64";
    const contentTypeTagName = "\r\ncontent-type: ";
    const bodyStartMarker = "\r\n\r\n";
    const bodyEndMarker = "\r\n--";
    var base64Content = [];
    var nextIndex = 0;

    // Find the start of the next section of interest.
    while((nextIndex = str.indexOf(contentTagName, nextIndex)) != -1)
    {
        // Skip past the tagname and look for the filename preamble.
        nextIndex += contentTagName.length;
        nextIndex = str.indexOf(fileNamePreamble, nextIndex);
        if(nextIndex == -1)
        {
            console.log("getGoogleDriveBase64Contents(): There should be a filename preamble.");
            console.log(str);
            break; // There should be a filename preamble.
        }

        // UEP-52311 Add full filenme line to output.
		var fileNameLineEndIndex = str.indexOf("\r\n", nextIndex + 2); // Skip past the leading \r\n of the fileNamePreamble string
        if(fileNameLineEndIndex == -1)
        {
            console.log("getGoogleDriveBase64Contents(): There should be a newline at the end of the filename line");
            console.log(str);
            break; // There should be the end of content-type.
        }
        var fileNameFullLine = str.substr(nextIndex, fileNameLineEndIndex - nextIndex).trim();


        // Skip past the filename preamble and look for the end of the filename.
        nextIndex += fileNamePreamble.length;
        var fileNameEndIndex = str.indexOf(fileNameEndMarker, nextIndex);
        if(fileNameEndIndex == -1)
        {
            console.log("getGoogleDriveBase64Contents(): There should be a filename end marker.");
            console.log(str);
            break; // There should be a filename end marker.
        }

        // Dig out the filename and skip past the filename end marker.
        var fileName = str.substr(nextIndex, fileNameEndIndex - nextIndex).trim();
        nextIndex = fileNameEndIndex + 1;

        // Look for the base64 file contents.
        nextIndex = str.indexOf(base64TagName, nextIndex);
        if(nextIndex == -1)
        {
            console.log("getGoogleDriveBase64Contents(): There should be base64 file contents.");
            console.log(str);
            break; // There should be base64 file contents.
        }

        // Skip past the tagname and look for the content-type marker.
        // If there is one, it will be on the next line.
        nextIndex += base64TagName.length;
        var contentType = "";
        if(str.substr(nextIndex, contentTypeTagName.length) == contentTypeTagName)
        {
            nextIndex += "\r\n".length; // Point to the start of the line.

            // Find the end of the content-type.
            var contentTypeEndIndex = str.indexOf("\r\n", nextIndex);
            if(contentTypeEndIndex == -1)
            {
                console.log("getGoogleDriveBase64Contents(): There should be the end of content-type.");
                console.log(str);
                break; // There should be the end of content-type.
            }

            contentType = str.substr(nextIndex, contentTypeEndIndex - nextIndex).trim();
            nextIndex = contentTypeEndIndex; // Should already be pointing to the body start marker, \r\n\r\n.
        }

        // Look for the body start marker.
        nextIndex = str.indexOf(bodyStartMarker, nextIndex);
        if(nextIndex == -1)
        {
            console.log("getGoogleDriveBase64Contents(): There should be a start-marker.");
            console.log(str);
            break; // There should be a start-marker.
        }

        // Point to the start of the body.
        nextIndex += bodyStartMarker.length;

        // Now find the end of the body.
        var base64DataEndIndex = str.indexOf(bodyEndMarker, nextIndex);
        if(base64DataEndIndex == -1)
        {
            console.log("getGoogleDriveBase64Contents(): There should be an end-marker.");
            console.log(str);
            break; // There should be an end-marker.
        }

        // Dig out the base64 data.
        var base64Data = str.substr(nextIndex, base64DataEndIndex - nextIndex).trim();
        base64Content.push({ _fileName : fileName, _fileNameLine : fileNameFullLine, _contentType : contentType, _base64Data : base64Data });
        nextIndex = base64DataEndIndex + 1;
    }

    // Return the array of "filename|base64 contents" elements.
    return base64Content;
}

// Consistent check between Chrome and IE. QIPCAP\HTTPMultiPartupload.c::IsMultiPartUpload()
// looks at URL and content-type.
function isGoogleDriveUpload(requestHeaders, url_google)
{
    if(url_google.toLowerCase().indexOf("google.com/upload/drive") == -1)
    {
        return false;
    }

    var multiPartUploadHeader = false;
    for(let hdr of requestHeaders)
    {
        if((hdr.name.toLowerCase() == "content-type" && hdr.value.toLowerCase().startsWith("multipart")))
        {
            multiPartUploadHeader = true;
            break;
        }
    }

    return multiPartUploadHeader;
}

// NativeMessaging Server process used its stdout to respond.
// This will be the TokenSessionId of the native process, which is
// the same as this browser process. UEP-36250.
function onSidResponse(response)
{
    if(response != null && response.sessionid != null)
    {
        sidSessionID = response.sessionid;
        if(sidSessionID >= 0)
        {
            // We have a valid sid. Use that as the session ID.
            mySessionID = "_" + sidSessionID.toString(); // Help DSE distinguish between a simple timestamp and a real session ID.

            //console.log("onSidResponse(). Using session ID: " + mySessionID.toString());
        }
        else // Should never happen. If we got a response, it will contain a session ID.
        {
            console.log("received invalid session id: " + response.sessionid);
            sidSessionID = uninitializedSidSessionID; // Try again next "new tab."
        }
    }
    else if(chrome.runtime.lastError != null)
    {
        console.log("error response: " + chrome.runtime.lastError.message);
        sidSessionID = uninitializedSidSessionID; // Try again next "new tab."
    }
}

// UEP-36250. Use native messaging to get the security identifier for the current user.
function getSidForUser()
{
    try
    {
        chrome.runtime.sendNativeMessage("com.forcepoint.usersessionidprovider", { "sessionid" : "Requesting Session ID" }, onSidResponse);
    }
    catch(e)
    {
        console.log(e.toString());
    }
}

// UEP-30280. Notify the xenapp server that we might have a new browser instance so
// it can assign the browser instance to the right PID and username.
function tabCreatedSessionID(tab)
{
    // UEP-36250. Put the user's session ID in the mySessionID variable as a deterministic way to identify the user.
    if(sidSessionID == uninitializedSidSessionID)
    {
        // This is asynchronous. mySessionID will be populated in the onSidResponse() callback.
        getSidForUser();
    }
}

// UEP-45886 : Whitelisting customer's internal site. Full paths are
var urlWhitelistRegEx = [/^(http[s]):\/\/contact-cl.*\.intactfc\.com\/contact-cl-pc-static/,
						 /^(http[s]):\/\/contact-cl.*\.intactfc\.com/,
						 /^(http[s]):\/\/contact-cl.*\.iad\.ca\.inet/,
						 /^(http[s]):\/\/confluence\.tooling\.intactfc\.cloud/,
						 /^(http[s]):\/\/contact-cl.*\.ocp-np-b\.iad\.ca\.inet\/contact-cl-pc-static\/business-information/,
						];
function isURLWhitelisted(url)
{
	for (var i = 0; i < urlWhitelistRegEx.length; i++)
	{
		if(url.toLowerCase().match(urlWhitelistRegEx[i]) != null)
		{
			return true;
		}
	}
	return false;
}

chrome.tabs.onCreated.addListener(tabCreatedSessionID);

chrome.webRequest.onBeforeRequest.addListener(
	function(details) {
		if ((chromeExtensionON == true)&& (details.method == "POST" || details.method == "PUT"))
		{
			request_map_cache[details.requestId] = details.requestBody;
            //chrome.tabs.query({lastFocusedWindow: true, active: true}, getActiveTabResult);
		}
		return {cancel: false};
	},
	{urls: ["<all_urls>"]},
	["blocking", "requestBody"]);

//***********************************************************************************************************************

// UEP-28748. Avoid the 404 error by removing the tab and replacing it with our website when the user clicks
// to update our chrome extension.
function tabCreated(tab)
{
	var myInfo;
	chrome.management.getSelf(function(extInfo)
	{
		myInfo = extInfo;
		var myUpdateURL = "https://chrome.google.com/webstore/detail/" + myInfo.id.toLowerCase();
		if(tab.url.toLowerCase() == myUpdateURL)
		{
			chrome.tabs.remove(tab.id);
			chrome.tabs.create({ url:"http://www.forcepoint.com"});
		}
	});
}

chrome.tabs.onCreated.addListener(tabCreated);

chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
		if (chromeExtensionON == false || (details.method != "POST" && details.method != "PUT"))
		{
            		return {cancel: false};
        	}

		if (details.url.match(/http\:\/\/127\.0\.0\.1\:55296\/ChromeExt\//i) != null ||
			details.url.match(/mail\.google\.com\/cloudsearch/i) != null)
		{
			//alert(details.url);
			return {cancel: false};
		}

		if(isURLWhitelisted(details.url))
		{
			return {cancel: false};
		}

		var content = "";
		var rawcontent = null;
		var files = "";
		var boundary = "";
		var header = "";
		var requestBody = get_request_body(details.requestId);
		var filename = "";
		var is_onedrive_personal_file_upload = false;
		var is_linkedin_file_upload = false;
		var is_office_365_file_upload = false;
		var content_type_header = '';
		var is_owa_upload = false;


		//UEP-40505, some request does not have body, may cause data leak
		//if(requestBody == null)
		//{
		//	return {cancel: false};
		//}
		//

		// - see comment in DSE->assemble_http_request -
		header += "X-BrowserExtension-ID: 2\r\n";

		// HTTP PUT is only for Google Drive multi-file upload (drive api v2)
		if(details.method == "PUT")
		{
			if(is_google_drive_batch_file_upload(details.requestHeaders) == false)
			{
				remove_request_from_cache(details.requestId); // remove previously cached requestBody
				return {cancel: false};
			}
		}

		// check for onedrive file upload case (required to have items/{itemId}/createUploadSession)
		// see https://docs.microsoft.com/en-us/onedrive/developer/rest-api/api/driveitem_createuploadsession
		if(details.url.match(/\:\/oneDrive\.createUploadSession/i) != null)
		{
			var onedrive_file_path = get_onedrive_personal_file_path(details.url);
			if(onedrive_file_path != '')
			{
				files += onedrive_file_path + "\n";
				is_onedrive_personal_file_upload = true;
			}
		}

		// check for sharepoint file upload case
		if(details.url.match(/\/_api\/web\/.*(startupload|addusingpath)/i) != null)
		{
			// use sharepoint rest api to extract the filename from the url-encoded sharepoint filepath
			var sharepoint_file_path = get_sharepoint_file_path(details.url);
			if(sharepoint_file_path != '')
			{
				//console.log(sharepoint_file_path);
				var file_name_ = sharepoint_file_path.substring(sharepoint_file_path.lastIndexOf('/')+1);
				files += file_name_ + "\n";
			}
		}
		else if(details.url.match(/CreateAttachmentFromLocalFile/i) != null)
		{
			is_office_365_file_upload = true;
		}
		if(details.url.match(/\/api\/voyagerMediaUploadMetadata/i) != null)
		{
			is_linkedin_file_upload = true;
		}


        // UEP-52311 Add Host header since chrome does not provide it
        var foundHostHeader = false;
        for(let hdr of details.requestHeaders)
        {
            if(hdr.name.toLowerCase() == "host")
            {
                foundHostHeader = true;
                break;
            }
        }

        if(!foundHostHeader)
        {
            var url = new URL(details.url);
            header += "Host: " + url.host + "\r\n";
        }


		// Classifier needs the headers in order to parse the MIME content properly
		details.requestHeaders.forEach(function(rH) {
			if(rH.name.toLowerCase() == "content-type")
			{
				boundary = get_boundary(rH.value);
				// for onedrive api resumable file upload, request body is optional, and contains json-formatted file data
				// since this information is sent to onedrive as part of http post, send to classifier as multipart message
				if(is_onedrive_personal_file_upload && boundary == '')
				{
					boundary = "--FPReqBoundary" + details.requestId; // complies with RFC2048
					if(requestBody != null && requestBody.raw != null && rH.value.indexOf("json") != -1 && !requestBody.formData)
					{
						requestBody.formData = new FormData();
						requestBody.formData["metadata"] = requestBody.raw.map(function(data) {
							return String.fromCharCode.apply(null, new Uint8Array(data.bytes))
							});
						requestBody.raw = null;
					}
					content_type_header = "multipart/form-data; boundary=" + boundary;
				}
				else content_type_header = rH.value;
			}
			else if(rH.name.toLowerCase() == "x-goog-upload-file-name")
			{
				// gmail file upload case for attachments
				files += decodeURIComponent(rH.value) + "\n";
			}
			else if(rH.name.toLowerCase() == "x-li-track")
			{
				// handle linkedin voyager file upload rest api
				// the filename is in the JSON-formatted raw content body.
				if(is_linkedin_file_upload && boundary == '')
				{
					boundary = "--FPReqBoundary" + details.requestId;
					// linkedin file upload for messages in the case of attachments
					if(requestBody != null && requestBody.raw != null && !requestBody.formData)
					{
						requestBody.formData = new FormData();
						requestBody.formData["metadata"] = requestBody.raw.map(function(data) {
						// UEP-38295 need to encode file path in correct way if the file name contains non-English characters.
						try{
							return decodeURIComponent(escape(String.fromCharCode.apply(null, new Uint8Array(data.bytes))));
						}
						catch(e){
								 return String.fromCharCode.apply(null, new Uint8Array(data.bytes));
						}});
						var json_object  = JSON.parse(requestBody.formData["metadata"]);
						if(json_object.filename != null)
							files += json_object.filename + "\n";
						requestBody.raw = null;
					}
					content_type_header = "multipart/form-data; boundary=" + boundary;
				}
			}
			/*
			else if(is_office_365_file_upload && (rH.name.toLowerCase() == "x-owa-urlpostdata"))
			{
				var json_object  = JSON.parse( decodeURIComponent(rH.value));
				if(json_object.Body.Attachments != null)
				{
					if(json_object.Body.Attachments[0] != null)
					{
						files += json_object.Body.Attachments[0].Name + "\n";
						content_type_header = json_object.Body.Attachments[0].ContentType;
					}
				}
				requestBody.raw = null;
			}*/
			//OWA attachment
			else if(rH.name.toLowerCase() == "x-owa-actionname")
			{
				if(rH.value.toLowerCase() == "createattachmentfromlocalfileaction" && requestBody != null && requestBody.raw != null)
				{

					var json_str = requestBody.raw.map(function(data) {
						let bytesView = new Uint8Array(data.bytes);
						let json_formatted_request_content = new TextDecoder().decode(bytesView);
						return json_formatted_request_content;
						});

						var json_object  = JSON.parse(json_str);
						if(json_object.Body != null && json_object.Body.Attachments[0] != null)
						{
							files += json_object.Body.Attachments[0].Name + "\n";
							content_type_header = json_object.Body.Attachments[0].ContentType;
						}
						requestBody.raw = null;
						header += rH.name + ": " + rH.value + "\r\n";
				}
			}
			//support office 365 and Outlook on the Web 2016
			else if(rH.name.toLowerCase() == "x-owa-urlpostdata")
			{
				var json_object  = JSON.parse( decodeURIComponent(rH.value));
				if(is_office_365_file_upload) //for attachment
				{
					if(json_object.Body.Attachments != null)
					{
						if(json_object.Body.Attachments[0] != null)
						{
							files += json_object.Body.Attachments[0].Name + "\n";
							content_type_header = json_object.Body.Attachments[0].ContentType;
						}
					}
					if(requestBody != null)
						requestBody.raw = null;
				}

				if(json_object.Body!= null)
				{
					//Email, Calendar, Tasks
					if(json_object.Body.Items != undefined)
					{
						if(json_object.Body.Items[0].Subject != undefined && json_object.Body.Items[0].Subject != "")
						{
							is_owa_upload = true;
							content += json_object.Body.Items[0].Subject + "\r\n";
						}
						if(json_object.Body.Items[0].Body != undefined )
						{
							if(json_object.Body.Items[0].Body.Value != undefined && json_object.Body.Items[0].Body.Value != "")
							{
								is_owa_upload = true;
								content += json_object.Body.Items[0].Body.Value + "\r\n";
							}
						}

						if(json_object.Body.Items[0].NewBodyContent != undefined
						   && json_object.Body.Items[0].NewBodyContent.Value != undefined && json_object.Body.Items[0].NewBodyContent.Value != "")
						{
							is_owa_upload = true;
							content += json_object.Body.Items[0].NewBodyContent.Value + "\r\n";
						}
					}

					if(json_object.Body.ItemChanges != undefined && json_object.Body.ItemChanges[0].Updates != undefined)
					{
						json_object.Body.ItemChanges[0].Updates.forEach(function (OWAIteam){
							if(OWAIteam.Item != undefined && OWAIteam.Item.Subject != undefined && OWAIteam.Item.Subject != "")
							{
								is_owa_upload = true;
								content += OWAIteam.Item.Subject + "\r\n";
							}
							if(OWAIteam.Item != undefined && OWAIteam.Item.Body != undefined && OWAIteam.Item.Body.Value != "")
							{
								is_owa_upload = true;
								content += OWAIteam.Item.Body.Value + "\r\n";
							}

						});
					}
				}
				// People Notes
				if(json_object.request != undefined && json_object.request.Body != undefined && json_object.request.Body.PropertyUpdates != undefined)
				{
					json_object.request.Body.PropertyUpdates.forEach(function (OWAProperty){
						if(OWAProperty.Path != undefined && OWAProperty.Path.FieldURI != undefined && OWAProperty.Path.FieldURI == "PersonaBodies")
						{
							if(OWAProperty.NewValue != undefined && OWAProperty.NewValue != "")
							{
								is_owa_upload = true;
								content += OWAProperty.NewValue + "\r\n";
							}
						}
					});
				}

			}
			else {
				header += rH.name + ": " + rH.value + "\r\n";
			}
		});

		if(is_owa_upload)
			header += "Content-Type: text/html; charset=UTF-8" + "\r\n";
		else
			header += "Content-Type: " + content_type_header + "\r\n";

		if (requestBody != null && requestBody.formData && requestBody.formData != null)
		{
			for (var key in requestBody.formData)
			{
				for (var i = 0; i < requestBody.formData[key].length; i++)
				{
					if (requestBody.formData[key][i] != null)
					{
                        if(key == "autosave_id") // UEP-31841. Regex was matching files here, so don't look for files in this tag.
                        {
                            content += requestBody.formData[key][i].substring(0, Math.min(512*1024, requestBody.formData[key][i].length));
                        }
                        else if ((requestBody.formData[key][i].match(/^[\w\s-'\.\)\(]+\.[\w]{1,10}$/) != null)&&(requestBody.formData[key][i].match(/^[\w\s-'\.\)\(]+\.[\d]{1,10}$/) == null))
						{	//match english filenames
							files += requestBody.formData[key][i] + "\n";
						}
						else if ((requestBody.formData[key][i].match(/^[\w\s-'\.\)\(\u4e00-\u9eff]+\.[\w\u4e00-\u9eff]{1,10}$/) != null)&&(requestBody.formData[key][i].match(/^[\w\s-'\.\)\(\u4e00-\u9eff]+\.[\d\u4e00-\u9eff]{1,10}$/) == null))
						{	//match english + cjk unicode (chinese, japanese, korean)
							files += requestBody.formData[key][i] + "\n";
						}
						else
						{
							if(boundary != "")
							{
								content += "\r\n--" + boundary;
								content += "\r\nContent-Disposition: form-data; ";
								content += "name=\"" + key + "\"\r\n\r\n";
							}
							content += requestBody.formData[key][i].substring(0, Math.min(512*1024, requestBody.formData[key][i].length));
						}
					}
				}
			}
		}
		else if (requestBody != null && requestBody.raw != null)
		{
			for (var i = 0; i < requestBody.raw.length; i++)
			{
				if (requestBody.raw[i].bytes != null)
				{
					if (rawcontent == null)
					{
						rawcontent = requestBody.raw[i].bytes;
					}
					else
					{
						var buf = new ArrayBuffer(rawcontent.byteLength + requestBody.raw[i].bytes.byteLength);
						var bufview = new Uint8Array(buf);
						var rawcview = new Uint8Array(rawcontent);
						var rawbview = new Uint8Array(requestBody.raw[i].bytes);
						bufview.set(rawcview, 0);
						bufview.set(rawbview, rawcview.length);
						rawcontent = buf;
					}
					// UEP-56655  parse filename from raw data for websites such as blomp.com
					var encodedStr = encodeURI(String.fromCharCode.apply(null, new Uint8Array(requestBody.raw[i].bytes)));
					var decoded = decodeURIComponent(encodedStr);
					const fileNameBegin = "; filename=\"";
					var n = decoded.indexOf(fileNameBegin);
					if (n != -1) 
					{
						n += fileNameBegin.length;
						let res = decoded.slice(n);
						const fileNameEnd = "\"";
						n = res.indexOf(fileNameEnd);
						if (n != -1) 
							files += res.slice(0, n) + "\n";
					}
				}
				else if (requestBody.raw[i].file != null)
				{
					files += requestBody.raw[i].file + "\n";
				}
			}
		}

		if (files == "" && rawcontent == null && content == "")
		{
			return {cancel: false};
		}

        var myRequest = new XMLHttpRequest();
        var async = false;
       	if(MOMode)
        {
        	async = true;
        }

        trimCache();
        let msgHash = "";
        let isGoogleDrive = isGoogleDriveUpload(details.requestHeaders, details.url);
        let str = "";
        if(isGoogleDrive)
        {
            filename = MakeHTTPRequestForDSE(myRequest, async, details, files, filename);
            str = CreateRequestString(rawcontent, header, content, boundary, filename, files);

            let __return;
            ({ __return, _, _, _, header } =
                ProcessGoogleDriveUpload(str, msgHash, myRequest, filename, async,
                    details, files, boundary, header));
            return __return;
        }

        let filesToProcess = files;
        let filesBlocked = 0;
        let runOnce = false;
        //we need to loop so multi file uploads like on dlptest can have each file checked for BLOCK
        while (filesToProcess.length > 0 || !runOnce){
            let requestFiles = "";
            // update filesToProcess and get the request file
            if (filesToProcess !== ""){
                let endline = "\n";
                let splitFiles = filesToProcess.split(endline);
                // remove the file from filesToProcess
                if (splitFiles.length > 1){
                    // check for the file path included after the file name
                    // some requests like uploads to dlptest will contain both the file name and full file path
                    // other requests will contain just the filename so we need to check
                    if (splitFiles[1].endsWith("\\" + splitFiles[0]) || splitFiles[1].endsWith("/" + splitFiles[0])){
                        requestFiles = splitFiles[0] + endline + splitFiles[1] + endline;
                    }else{
                        requestFiles = splitFiles[0] + endline;
                    }
                }else{
                    requestFiles = splitFiles[0] + endline;
                }
                filesToProcess = filesToProcess.substring(requestFiles.length);
                // if all thats left is an endline then remove it
                if (filesToProcess === endline){
                    filesToProcess = "";
                }
            }

            filename = MakeHTTPRequestForDSE(myRequest, async, details, requestFiles, filename);

            str = CreateRequestString(rawcontent, header, content, boundary, filename, requestFiles);

            let parser = document.createElement('a');
            parser.href = details.url;
            let msgForHash = parser.protocol + "//" + parser.host + parser.pathname;
            parser.remove();

            // Normal case, msgForHash = (protocol + // + host + path + files + str).
            // UEP-69400 In case of onedrive uploads , the cancellation request sent out by extension is not handled by onedrive
            // resulting in repeat notification from endpoint. To remedy the repeated notification the msgForHash is modified
            // to exclude str. Str includes requestID  which is unique to each HTTP POST request sent by onedrive.
            
            msgForHash += requestFiles;
            if(!is_onedrive_personal_file_upload)   
            {
                    msgForHash += str;
            }
            msgHash = calcMD5(msgForHash);
            if(msgHash in wsResultMapCache)
            {
                //console.log("Cached: " + msgHash + "TS: " + formatTime(wsResultMapCache[msgHash]) + " CT: " + formatTime(details.timeStamp));
                // UEP-31700. Update the timestamp here after the successful cache hit. this is
                // so the popup for this file won't happen automatically every 30 seconds. That
                // would mystify the user (google is still trying to upload the file long after Cancel).
                wsResultMapCache[msgHash] = new Date().getTime();
                return {cancel: true};
            }

            QueryDSEForBlock(myRequest, str);
            if (cpsResultAnswer === "BLOCK"){
                filesBlocked++;
            }
            runOnce = true;
        }

        if (cpsResultAnswer === "BLOCK" || filesBlocked > 0)
        {
            cpsResultAnswer = "ALLOW";      	//Change to default for next use
            wsResultMapCache[msgHash] = new Date().getTime(); // trimCache() uses same date/time api for comparison.
            return {cancel: true};
        }

		return {cancel: false};
	},
	{urls: ["<all_urls>"]},
	["blocking", "requestHeaders"]);

// Create the request string for querying DSE
function CreateRequestString(rawcontent, header, content, boundary, filename, files){
    let str = "";
    if (rawcontent != null)
    {
        header += "Content-Length: ";
        header += rawcontent.byteLength.toString() + '\r\n\r\n';
        let data = new Uint8Array(header.length + rawcontent.byteLength);
        let rawview = new Uint8Array(rawcontent);
        for (let i = 0; i < header.length; i++)
        {
            data[i] = header.charCodeAt(i);
        }
        data.set(rawview, header.length);
        try{
            str = String.fromCharCode.apply(null, data);
            str = covert_file_name(str);
        } catch(RangeError)
        {
            // caught exception for stack overflow. Using workaround...
            for(let charCode of data)
            {
                str += String.fromCharCode(charCode);
            }
        }
        return str;
    }

    if (files !== "")
    {
        if (content !== "")
        {
            header += content + "\r\n";
        }

        if(boundary !== "")
        {
            header += "\r\n--" + boundary + "\r\n";
        }
        header += "Content-Disposition: attachment; filename=\"" + filename + "\"\r\n";
        str = header;
    }
    else
    {
        header += "\r\n";
        str = header + content;
    }

    return str;
}

// ProcessGoogleDriveUpload() parses the POST request and blocks the first sensitive content it finds.
// We will send DSE a POST for each file that Google drive is trying to upload. Such as the following
// example of two files sent to DSE over 127.0.0.1:
//      https://jira.websense.com/browse/UEP-33844, see attachment RcvSocketReaderTrace.txt
function ProcessGoogleDriveUpload(str, msgHash, myRequest, filename, async, details, files, boundary, header)
{
    const base64Preamble = "content-transfer-encoding: base64\r\n";
    const contentLengthTag = "Content-Length: ";
    const fileNameLinePreamble = "content-type: application/json; charset=UTF-8\r\n\r\n"

    // UEP-33245. Chrome continues to repeatedly attempt the upload, causing DLP to
    // continually display the block warnings. The format of the request is consistent,
    // so do a quick parse on just the base64 contents and hash off of that.
    var isBlock = false;
    var isFirstTime = true;
    var base64Contents = getGoogleDriveBase64Contents(str);

	for(var contents_index = 0; contents_index < base64Contents.length; ++contents_index)
    {
		var element = base64Contents[contents_index];
		msgHash = calcMD5(element._fileName + element._base64Data);
        if (msgHash in wsResultMapCache)
        {
            // UEP-31700. Update the timestamp here after the successful cache hit. this is
            // so the popup for this file won't happen automatically every 180 seconds. That
            // would mystify the user (google is still trying to upload the file long after Cancel).
            wsResultMapCache[msgHash] = new Date().getTime();
			isBlock = true; // Remember to cancel.
			break; // One block trumps anything good in this post. Get out of the for() loop.
		}

		// If we're first-time in this loop, we can use the existing http request already created.
		// Otherwise, we need a new one.
		if (!isFirstTime)
		{
			myRequest = new XMLHttpRequest(); // GC collects the old one.
			filename = MakeHTTPRequestForDSE(myRequest, async, details, files, filename);
		}

		isFirstTime = false;

		// Set the filename for the Log Viewer.
		filename = element._fileName;
		myRequest.setRequestHeader("X-Attach-File", btoa(unescape(encodeURIComponent(filename))));

		// Set the contents for the CPS analyzer.
		var base64Blob = element._base64Data;
		var base64ContentType =  element._contentType;
		var htmlStart = (boundary.length > 0) ? "--" + boundary + "\r\n" : "";
		var htmlTerminator = (boundary.length > 0) ? "\r\n--" + boundary + "--\r\n" : "\r\n";
        var fileNameLine = element._fileNameLine;

		// This is what the CPS analyzer needs.
		var htmlContent = htmlStart + fileNameLinePreamble + fileNameLine + "\r\n" + // UEP-52311 Include filename line
            htmlStart + base64Preamble + base64ContentType + "\r\n\r\n" +
			base64Blob + htmlTerminator;

		// Fix the content-length parameter in the header.
		var htmlContentLength = htmlContent.length;
		var headerLines = header.split("\r\n");
		for (var i = 0; i < headerLines.length; i++)
		{
			if (headerLines[i].startsWith(contentLengthTag))
			{
				headerLines[i] = contentLengthTag + htmlContentLength.toString();
				break;
			}
		}

		header = headerLines.join("\r\n");

		// Send the post for this filename to DSE.
		var htmlPost = header + htmlContent;
		QueryDSEForBlock(myRequest, htmlPost);
		if (cpsResultAnswer == "BLOCK")
		{
			cpsResultAnswer = "ALLOW"; //Change to default for next use
			wsResultMapCache[msgHash] = new Date().getTime(); // trimCache() uses same date/time api for comparison.
			isBlock = true; // Remember to cancel.
			break; // One block trumps anything good in this post. Get out of the for() loop.
		}
	}

	//UEP-40718 - If we are blocking one file in the batch, block them all
	if(isBlock)
	{
		base64Contents.forEach(element =>
		{
			msgHash = calcMD5(element._fileName + element._base64Data);
			wsResultMapCache[msgHash] = new Date().getTime();
		});
	}

    return { __return: { cancel: isBlock }, msgHash, myRequest, filename, header };
}

// Generate and populate the http request to DSE on the loopback adapter.
// This is called during google drive multi-file upload once for each separate file in the upload.
// If not a google drive upload, it is called once from the main logic path.
function MakeHTTPRequestForDSE(myRequest, async, details, files, filename)
{
    myRequest.open("POST", DSE_BASE_URL + mySessionID, async);
    myRequest.setRequestHeader("X-Email-Url", details.url);
    if (typeof tabToUrl[details.tabId] != "undefined")
    {
        myRequest.setRequestHeader("X-Referrer", tabToUrl[details.tabId].substr(0, 2083)); //max url length is
    }
    else
    {
        myRequest.setRequestHeader("X-Referrer", "undefined");
    }

    myRequest.setRequestHeader("X-TimeStamp", details.timeStamp);
    myRequest.setRequestHeader("X-InPrivate", chrome.extension.inIncognitoContext);

    // UEP-51404: pass the browser tab id to DSE via header so the confirmation dialog box
    // can be suppressed if a violation is initiated from the same tab before
    // the damper timer expires.
     myRequest.setRequestHeader("X-BrowserTab-ID", details.tabId);

    // origin header is set in request headers
    //var header = "Origin: https://mail.google.com\r\n";
    if (files != "")
    {
        var slashN = files.indexOf('\n');
        //var backslash = files.lastIndexOf('/', slashN);
        //var filename = files.substring(backslash+1, slashN);
        filename = files.substring(0, slashN);
        myRequest.setRequestHeader("X-Attach-File", btoa(unescape(encodeURIComponent(filename))));
        // console.log(files);
    }

    return filename;
}

// Talk to DSE and get an answer back: BLOCK or ALLOW.
// This is called during google drive multi-file upload once for each separate file in the upload.
// If not a google drive upload, it is called once from the main logic path.
function QueryDSEForBlock(myRequest, str) {
    try {
        myRequest.send(str);
    }
    catch (e) {
        chromeExtensionON = false; //Service is DOWN, turn off Chrome Extension
    }
    if (myRequest.readyState == 4) {
        //alert("Status: " + myRequest.status + ", Action: " + myRequest.responseText);
        if (myRequest.status == 200) {
            cpsResultAnswer = myRequest.responseText; //Could be "ALLOW" or "BLOCK", ...
        }
        else if (myRequest.status == 0 || //Service is DOWN
            myRequest.status == 500) { //Web Channel of OFF, turn off Chrome Extension
            chromeExtensionON = false;
        }
        else {
            //POST data ERROR:
            console.log("POST response ERROR code: " + myRequest.status);
            cpsResultAnswer = "BLOCK";
        }
    }
}

function SendDetailsUrlVisit(details)
{
	var myRequest = new XMLHttpRequest();
	myRequest.open("POST", DSE_BASE_URL + mySessionID, true);
	try {
		if(typeof details.url != "undefined"){
			myRequest.setRequestHeader("X-Visited-Url", details.url.substr(0,2083)); //max url length is 2084
		} else {
			myRequest.setRequestHeader("X-Visited-Url", "");
		}
		myRequest.setRequestHeader("X-Method", details.method);
		myRequest.setRequestHeader("X-TimeStamp", details.timeStamp)
		myRequest.setRequestHeader("X-Status", details.statusCode);
        myRequest.setRequestHeader("X-InPrivate", chrome.extension.inIncognitoContext);
        if (typeof tabToUrl[details.tabId] != "undefined")
        {
            myRequest.setRequestHeader("X-Referrer", tabToUrl[details.tabId].substr(0, 2083)); //max url length is
        } else {
			myRequest.setRequestHeader("X-Referrer", "");
		}
		if (details.originUrl>-1)
		{
			myRequest.setRequestHeader("X-Tab-Url", tabToUrl[tabId]);
		}
		// UEP-51404: pass the browser tab id to DSE via header so the confirmation dialog box
		// can be suppressed if a violation is initiated from the same tab before
		// the damper timer expires.
		myRequest.setRequestHeader( "X-BrowserTab-ID", details.tabId );

		myRequest.send("This is a GET request");
	} catch (e) {
		chromeExtensionON = false;
	}
}


chrome.webRequest.onCompleted.addListener(
	function(details){
		if(isURLWhitelisted(details.url))
		{
			return {cancel: false};
		}
		if(!F1EWebsiteVisitedEnabled){
			return {cancel: false};
		}
		if(chromeExtensionON == false){
			return {cancel: false};
		}
		if(details.url.match("127\.0\.0\.1") != null){
			return {cancel: false};
		}
		if(details.method == "GET"){
			SendDetailsUrlVisit(details);
		}
	},
	{urls: ["<all_urls>"]},
	["responseHeaders"]
);



/**********************************************************************************************************************
	 Tim added on 4/26/2017
 **********************************************************************************************************************/
//var urlMap = {};
var tabToUrl = {};
function SendUrl(url, action)
{
	var myRequest = new XMLHttpRequest();
	myRequest.open("POST", DSE_BASE_URL + mySessionID, true);
	myRequest.setRequestHeader("X-Email-Url", url);
	myRequest.setRequestHeader("X-Attach-File",btoa(unescape(encodeURIComponent("FP2017\\Chrome\\" + action))));
	try { myRequest.send("This is a URL request from chrome extension"); }
	catch (e) {
		chromeExtensionON = false;                      	//Service is DOWN, turn off Chrome Extension
	}
};


//-------------------------- print blocking support -----------------------------------------------

const DSE_TMP_FILE_URL = "http://127.0.0.1:55053/"   // htons(0xdd7)

function createDownload(type, param1, param2) {
    if (type == 'OneDrive') {
        // param1 = url, param2 = name
        return new OneDriveDownload(param1, param2);
    } else if (type == 'OneDriveForBusiness') {
        // param1 = url, param2 = name
        return new OneDriveForBusinessDownload(param1, param2);
    } else if (type == 'Sharepoint') {
        // param1 = url, param2 = name
        return new SharepointDownload(param1, param2);
    } else if (type == 'GoogleDrive') {
        // param1 = url, param2 = name
        return new GoogleDriveDownload(param1, param2);
    } else if (type == 'PrintEvent') {
        // param1 = tabId, param2 = inputContent (received from SendMessage in content.js)
        return new PrintEventDownload(param1, param2);
    }
};

class DownloadFileTemplate {

    constructor(url, name) {
        this.url = url;

        // extract name out of the path. Do nothing, if it is just a name.
        this.name = name.replace(/^.*[\\\/]/, '');

        this.browserName = this.getBrowserName();
    }


    getSubstring(SourceString, StringToSearch, delimiterString) {
        let str;

        var n = SourceString.indexOf(StringToSearch);
        if (n != -1) {
            n += StringToSearch.length;
            if (delimiterString == null)
                str = SourceString.slice(0, n);
            else
                str = SourceString.substring(n, SourceString.indexOf(delimiterString, n));
        };

        return str;
    }


    /*******************
    //from https://stackoverflow.com/questions/48447550/how-can-i-send-a-binary-data-blob-using-fetch-and-formdata
    ********************/

    async postFileToDSE(url) {
        const response = await fetch(url);
        const content = await response.blob();
        // post it using sockets
        fetch(DSE_TMP_FILE_URL, { method: 'post', body: content })
            .catch(err => { console.log(err) });
    };


    //Default implementation
    downloadFile() {
        console.log('base downloadFile');
    }

    //Edge:
    //    navigator.userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36 Edg/83.0.478.54"
    //vendor: "Google Inc."
    //Firefox:
    //    navigator.userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:77.0) Gecko/20100101 Firefox/77.0"
    //navigator.vendor: ""
    //Chrome:
    //    navigator.userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36"
    //navigator.vendor: "Google Inc."
    getBrowserName() {
        if (navigator.userAgent.indexOf('Edg/') != -1)
            return 'Edge';
        else if (navigator.userAgent.indexOf('Firefox/') != -1)
            return 'Firefox';
        else {
            return 'Chrome';
        }
    }

};


class OneDriveDownload extends DownloadFileTemplate {

    constructor(url, name) {
        super(url, name);
    }


    buildDownloadUrl() {
        // download link can be created out of regular click link like (for an office file like word, excel etc.):
        // https://onedrive.live.com/edit.aspx?cid=bcc84d3ed97e4f5f&page=view&resid=BCC84D3ED97E4F5F!1484&parId=BCC84D3ED97E4F5F!106&app=Word
        // https://onedrive.live.com/download?cid=bcc84d3ed97e4f5f&resid=BCC84D3ED97E4F5F!1484

        // or other files, like .txt etc:
        // https://onedrive.live.com/?cid=BCC84D3ED97E4F5F&id=BCC84D3ED97E4F5F%211786&parId=BCC84D3ED97E4F5F%21106&o=OneUp
        // https://onedrive.live.com/download?cid=BCC84D3ED97E4F5F&resid=BCC84D3ED97E4F5F%211786

        // name has following pattern:
        // "Documents - OneDrive" or "sensitiveHTML.html - OneDrive" it seems that the suffix " - OneDrive" need to be removed

        let urlToCall;

        let nm = " - OneDrive";
        if (this.name.indexOf(nm) != -1)
            this.name = this.name.slice(0, this.name.length - nm.length);

        var str = "live.com/";
        var n = this.url.indexOf(str);
        var preffix = this.url.slice(0, n + str.length);

        // find ".aspx?" if yes - copy "cid=..&", find "resid=" - copy "resid=..&"
        // concat "..live.com", "download?","cid=..&","resid=..&"
        // else if find "?cid=..&" at the beginning of the str, find "&id=..&"
        // concat "..live.com", "download?",

        str = ".aspx?";
        n = this.url.indexOf(str);
        if (n != -1) {

            // get cid
            let start = n + str.length;
            let end = this.url.indexOf("&", start);
            let cid = this.url.slice(start, end);

            // get resid
            start = this.url.indexOf("resid=");
            end = this.url.indexOf("&", start);
            let recid = this.url.slice(start, end);

            // create url
            urlToCall = preffix + "download?" + cid + "&" + recid;
        }
        else {
            // get cid
            n = this.url.indexOf("cid=");
            if (n != -1) {
                let start = n;
                let end = this.url.indexOf("&", start);
                let cid = this.url.slice(start, end);

                // get resid
                start = this.url.indexOf("&id=");
                end = this.url.indexOf("&", start + 1);
                // skip "&id=":
                let recid = this.url.slice(start + 4, end);

                // create url
                urlToCall = preffix + "download?" + cid + "&" + "resid=" + recid;
            }
            else
                urlToCall = "";
        }
        return urlToCall;
    }


    downloadFile() {
        let urlToCall = this.buildDownloadUrl();
        this.postFileToDSE(urlToCall);
    }
};


class OneDriveForBusinessDownload extends DownloadFileTemplate {
    constructor(url, name) {
        super(url, name);
    }

    getObjectByValue = function (array, key, value) {
        return array.filter(function (object) {
            return object[key] === value;
        });
    }

    // For OneDriveForBusiness support:
    // If in the calledUrl present "&parent=" block, so according it seems that it is not office suite document (not word, excel etc document) that is stored
    // in the Onedrive folder and will be opened in the different way. The input argument name in this case is wrong, the file name need to be extracted from
    // the calling url.
    getName() {
        const str = "&parent=";
        var n = this.url.indexOf(str);
        if (n == -1) {
            return this.name;
        }
        else {
            let dividerStart = n + str.length;
            let divider = this.url.slice(dividerStart, this.url.length);

            let beginningDevider = this.url.indexOf(divider);
            beginningDevider += divider.length + 3;  // + lenght of %2F separator
            let docName = this.url.slice(beginningDevider, this.url.length - divider.length - str.length);
            docName = decodeURIComponent(docName);
            return docName;
        }
    }


    buildGraphApiUrl() {
        // MSFT Graph API endpoint atht OneDrive uses at the moment is one in sharePintApiPreffix
        // something like that:
        // url = "https:\/\/forcepointcml-my.sharepoint.com\/_api\/v2.0\/drive\/root\/search(q=\'Test%20doc%20-%20with%20keyword\')?select=name";
        // url = "https://forcepointcml-my.sharepoint.com/_api/v2.0/drive/root/search(q='Test%20doc%20-%20with%20keyword')?select=name";
        // calledUrl is something like that:
        // https://forcepointcml.sharepoint.com/:w:/r/sites/EndpointEngineering/_layouts/15/Doc.aspx?sourcedoc=%7BA6186627-155A-4285-BC17-82FE29C30485%7D&file=KeyWord.docx&action=default&mobileredirect=true
        ////https://forcepointcml-my.sharepoint.com/personal/lev_kantorovich_forcepoint_com/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Flev%5Fkantorovich%5Fforcepoint%5Fcom%2FDocuments%2FTest%5Ffor%5Fprinting%5Fissue%2Etxt&parent=%2Fpersonal%2Flev%5Fkantorovich%5Fforcepoint%5Fcom%2FDocuments

        this.name = this.getName();

        let sharePintApiPreffix = "\/_api\/v2.0\/drive\/root\/search(q=\'";
        let sharePintApiEnding = "\')";

        const str = "sharepoint.com";
        var n = this.url.indexOf(str);

        if (n != -1) {
            n += str.length;
            let res = this.url.slice(0, n);
            var url = res + sharePintApiPreffix + this.name + sharePintApiEnding;
        }

        return url;
    }

    downloadFile() {
        let url = this.buildGraphApiUrl();

        fetch(url)
            .then(res => res.json())
            .then((out) => {
                // the result is the record for the file, containing 'id'
                return out.value[0]['id'];
            })
            // to get the download url, need following modification :
            // https://forcepointcml-my.sharepoint.com/_api/v2.0/drive/items/<id>/content
            // something like:
            //https://forcepointcml-my.sharepoint.com/_api/v2.0/drive/items/012PWVSGL35Z5AX2G5GRA23RCUVIQG2WI3/content
            .then((out) => {

                const str = "root\/";
                let n = url.indexOf(str);
                let res = url.slice(0, n);
                url = res + "items\/" + out + "\/content";

                        this.postFileToDSE(url);
                    })
            .catch(err => { throw err });
    };
};


class SharepointDownload extends DownloadFileTemplate {
    constructor(url, name) {
        super(url, name);
    }

    getObjectByValue = function (array, key, value) {
        return array.filter(function (object) {
            return object[key] === value;
        });
    }

    getName() {
        const str = "&parent=";
        var n = this.url.indexOf(str);
        if (n != -1) {
            // https://forcepointcml.sharepoint.com/sites/EndpointEngineering/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FEndpointEngineering%2FShared%20Documents%2FUpdatedBAT%2FKeyWord%2Ehtml&parent=%2Fsites%2FEndpointEngineering%2FShared%20Documents%2FUpdatedBAT
            let dividerStart = n + str.length;
            let divider = this.url.slice(dividerStart, this.url.length);

            let beginningDevider = this.url.indexOf(divider);
            beginningDevider += divider.length + 3;  // + lenght of %2F separator
            let docName = this.url.slice(beginningDevider, this.url.length - divider.length - str.length);
            docName = decodeURIComponent(docName);
            return docName;
        }
        else {
            // https://forcepointcml.sharepoint.com/:w:/r/sites/EndpointEngineering/_layouts/15/Doc.aspx?sourcedoc=%7BA6186627-155A-4285-BC17-82FE29C30485%7D&file=KeyWord.docx&action=default&mobileredirect=true&DefaultItemOpen=1
            return this.name;
        }

    }


    buildGraphApiUrl() {
        // We have original request in this form:
        // https://forcepointcml.sharepoint.com/:w:/r/sites/EndpointEngineering/_layouts/15/Doc.aspx?sourcedoc=%7BA6186627-155A-4285-BC17-82FE29C30485%7D&file=KeyWord.docx&action=default&mobileredirect=true&cid=83166048-67cc-4883-a2e0-06c0d75367cb

        this.name = this.getName();

        // how to get the file download url:
        // 1) get site id that will be used for the file download url request:
        //  https://forcepointcml.sharepoint.com/_api/v2.0/sites/forcepointcml.sharepoint.com:/sites/EndpointEngineering?$select=id
        // we need extract following components:
        // - url:                       "https://forcepointcml.sharepoint.com"
        // - sharepoint server id:      "forcepointcml.sharepoint.com"
        // - the path inside the site:  "EndpointEngineering". The path can be in form "EndpointEngineering/something/something"

        // a) get site path

        let printApiPart = "\/_api\/v2.0\/sites\/";
        let url = this.getSubstring(this.url, "sharepoint.com", null);
        let path = this.getSubstring(this.url, "\/sites\/", "\/");
        let serverId = url.slice(8);  // something like "forcepointcml.sharepoint.com"

        url = url + printApiPart + serverId + ":\/sites\/" + path + "\?\$select=id";
        // now url is something like https://forcepointcml.sharepoint.com/_api/v2.0/sites/forcepointcml.sharepoint.com:/sites/EndpointEngineering?$select=id

        return url;
    }

    downloadFile() {

        let url = this.buildGraphApiUrl();

        fetch(url)
            .then(res => res.json())
            .then((out) => {
                // id will look like this one: 'forcepointcml.sharepoint.com,15ec2ba7-6097-4568-b01d-830467bfecd0,7b19ed32-28b3-4512-919b-dc85d7a336f7'
                return out['id'];
            })
            .then((out) => {
                //https://forcepointcml.sharepoint.com/_api/v2.0/sites/forcepointcml.sharepoint.com,15ec2ba7-6097-4568-b01d-830467bfecd0,7b19ed32-28b3-4512-919b-dc85d7a336f7/drive/root/search(q='keyword.docx')
                // get list of DriverItems that have the same name as we looking for:

                url = this.getSubstring(url, "\/sites\/", null);

                let Id = out;
                let sharePintApiMiddle = "\/drive\/root\/search(q=\'";
                let sharePintApiEnding = "\')"

                url = url + Id + sharePintApiMiddle + this.name + sharePintApiEnding;     // build request url

                fetch(url)
                    .then(res => res.json())
                    .then(out => {
                        // get DriveItem record
                        return this.getObjectByValue(out.value, "name", this.name)[0];
                    })
                    .then((out) => {
                        // the result is the record for the file, containing 'id'
                        return out['id'];
                            })

                    // now the same as for OneDriveForBusiness
                    // to get the download url, need following modification :
                    // https://forcepointcml-my.sharepoint.com/_api/v2.0/drive/items/<id>/content
                    // something like:
                    //https://forcepointcml-my.sharepoint.com/_api/v2.0/drive/items/012PWVSGL35Z5AX2G5GRA23RCUVIQG2WI3/content

                    .then((out) => {
                        const str = "root\/";
                        let n = url.indexOf(str);
                        let res = url.slice(0, n);
                        url = res + "items\/" + out + "\/content";

                                this.postFileToDSE(url);
                            })
                    .catch(err => { throw err });
            })
            .catch(err => { throw err });
    };
};


class GoogleDriveDownload extends DownloadFileTemplate {
    constructor(url, name) {
        super(url, name);
    }

    downloadFile() {
        // parsing assumes google drive keeps URL format of:
        // docs.google.com/<filetype>/d/<fileid>/edit
        let lastSlashIndex = this.url.lastIndexOf("\/");
        let exportUrl = this.url.substr(0, lastSlashIndex);

        // export url different for google slides
        if (this.url.indexOf("presentation") != -1)
            exportUrl = exportUrl + "\/export\/pdf";
        else
            exportUrl = exportUrl + "\/export?format=pdf";

        this.postFileToDSE(exportUrl);
    }
};


class PrintEventDownload extends DownloadFileTemplate {
    tabId;
    inputContent;

    constructor(tabId, inputContent) {
        super('', '');

        this.tabId = tabId;
        this.inputContent = inputContent;
    }

    downloadFile() {
        this.savePage(this.tabId, this.inputContent);
    }

    // main processing for the local files
    // convertBlob - caller provided function that delivers the content to DSE
    LocalFilePathToDse(filePath, fileName) {
        let cutContent = filePath;
        let joined_blob = new Blob([cutContent]);
        return joined_blob;
    };



    // tabId - the path of the local file, if there is attept to print the file,
    // inputContent - file name in form "name.ext"
    // or integer value, if a user trying to print an html page
    // and inputContent in this case - content of the page input fields
    savePage(tabId, inputContent) {

        if (typeof tabId === 'number') {
            chrome.pageCapture.saveAsMHTML({
                tabId: tabId
            }, function (blob) {
                const textPromise = blob.text().then(function (result) {
                    // The saved .mhtml file doesn't contain input fields and text areas values
                    // They were passed from the content script in the message and
                    // these values will be added to .mhtml file as separate MIME section

                    // parse MIME - find the section boundary string
                    let tmpstr = 'boundary=\"';
                    let boundarystart = result.indexOf(tmpstr) + tmpstr.length;
                    let boundaryend = result.indexOf('\"\r\n', boundarystart);
                    let boundary = '--' + result.substr(boundarystart, boundaryend - boundarystart);

                    // parse MIME - remove the file ending boundary separator, add the section
                    // with inputContent and then close the section and the file with ending separator
                    let endingIndex = result.lastIndexOf(boundary);
                    let cutContent = result.slice(0, endingIndex);
                    cutContent = cutContent + '\r\n' + boundary + '\r\n' + '\r\n' + 'Content-Type: text/html\r\nContent-Transfer-Encoding: quoted-printable;\r\n\r\n';
                    cutContent = cutContent + '<html><head></head><body><textarea>' + inputContent + '</textarea></body></html>\r\n'
                    cutContent = cutContent + boundary + '--';

                    let joined_blob = new Blob([cutContent]);
                    fetch(DSE_TMP_FILE_URL, { method: 'post', body: joined_blob })
                        .catch(err => { throw err });
                });
            });

        }
        else {
            let filePath = this.LocalFilePathToDse(tabId, inputContent);
            // inputContent in this case contains the file name
            fetch(DSE_TMP_FILE_URL, { method: 'post', body: filePath })
               .catch(err => { throw err });

        };
        //chrome.pageCapture.saveAsMHTML({
        //    tabId: tabId
        //}, function (blob) {
        //    const textPromise = blob.text().then(function (result) {
        //        // The saved .mhtml file doesn't contain input fields and text areas values
        //        // They were passed from the content script in the message and
        //        // these values will be added to .mhtml file as separate MIME section

        //        // parse MIME - find the section boundary string
        //        let tmpstr = 'boundary=\"';
        //        let boundarystart = result.indexOf(tmpstr) + tmpstr.length;
        //        let boundaryend = result.indexOf('\"\r\n', boundarystart);
        //        let boundary = '--' + result.substr(boundarystart, boundaryend - boundarystart);

        //        // parse MIME - remove the file ending boundary separator, add the section
        //        // with inputContent and then close the section and the file with ending separator
        //        let endingIndex = result.lastIndexOf(boundary);
        //        let cutContent = result.slice(0, endingIndex);
        //        cutContent = cutContent + '\r\n' + boundary + '\r\n' + '\r\n' + 'Content-Type: text/html\r\nContent-Transfer-Encoding: quoted-printable;\r\n\r\n';
        //        cutContent = cutContent + '<html><head></head><body><textarea>' + inputContent + '</textarea></body></html>\r\n'
        //        cutContent = cutContent + boundary + '--';

        //        let joined_blob = new Blob([cutContent]);
        //        let url = URL.createObjectURL(joined_blob);
        //        chrome.downloads.download({
        //            filename: DownloadFileTemplate.mysubdirectory + DownloadFileTemplate.downloadSubfolder,
        //            conflictAction: 'overwrite',
        //            url: url,
        //            saveAs: false
        //        }, function (downloadId) {
        //            console.log('downloads.download callback:', url, chrome.runtime.lastError);

        //            DownloadFileTemplate.saveDownloadId = downloadId;

        //            // to clean the download history after that
        //            chrome.downloads.onChanged.addListener(onChanged);
        //        });
        //    });
        //});
    };
};


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

        // The message that contains input filds and textarea values will start from "MyInputFieldValues, "
        // the values will be added to .mhtml file as separate section
        if (request.indexOf("MyInputFieldValues, ") != -1) {
            tabToUrl[sender.tab.id] = sender.tab.url;
            let downloadEntity;

            // only docs gets onBeforePrint message from content.js
            if (sender.url.indexOf("docs.google") != -1) {
                downloadEntity = createDownload('GoogleDrive', sender.url, '');
                downloadEntity.downloadFile();
            }
            else {
                // use this case only if it is not sharepoint or oneDrive personal
                if (sender.url.indexOf('sharepoint.com') == -1 && sender.url.indexOf('live.com/') == -1) {
                    downloadEntity = createDownload('PrintEvent', sender.tab.id, request);
                    downloadEntity.downloadFile();
                }
            }
        }
    }
);

//------------------------- end specific print blocking support code -------------------------------------


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (chromeExtensionON == false)
        return { cancel: false };

    if (typeof tab.url != "undefined" && isURLWhitelisted(tab.url)) {
        return { cancel: false };
    }

    if (changeInfo.status == "complete") {
        //alert('0' + tab.url);
        tabToUrl[tabId] = tab.url;
        SendUrl(tab.url, "0"); // new tab loaded or reloaded

        // for print blocking support
        let downloadEntity;
        if (typeof tab.url != "undefined") {
            if (tab.url.indexOf("file:///") != -1 && tab.url.indexOf(".pdf") != -1) {
                tabToUrl[tabId] = tab.url;
                downloadEntity = createDownload('PrintEvent', tab.url, tab.title);
                downloadEntity.downloadFile();
            }
            else if (tab.url.indexOf("file:///") == -1) {
                if (tab.url.indexOf("my.sharepoint.com") != -1) {
                    tabToUrl[tabId] = tab.url;
                    downloadEntity = createDownload('OneDriveForBusiness', tab.url, tab.title);
                    downloadEntity.downloadFile();
                }
                else if (tab.url.indexOf("sharepoint.com") != -1) {
                    tabToUrl[tabId] = tab.url;
                    downloadEntity = createDownload('Sharepoint', tab.url, tab.title);
                    downloadEntity.downloadFile();
                }
                else if (tab.url.indexOf(".live.com") != -1) {
                    tabToUrl[tabId] = tab.url;
                    downloadEntity = createDownload('OneDrive', tab.url, tab.title);
                    downloadEntity.downloadFile();
                }
                else if (tab.url.indexOf("docs.google") != -1) {
                    tabToUrl[tabId] = tab.url;
                    downloadEntity = createDownload('GoogleDrive', tab.url, tab.title);
                    downloadEntity.downloadFile();
                }
            }
        }
    }
    else if (changeInfo.status == "loading") {
        if (typeof tab.url != "undefined") {
            if (tab.url.indexOf("file:///") != -1) {
                tabToUrl[tabId] = tab.url;
                SendUrl(tab.url, "0"); // the tab just changed url
            }
        }
    } /* UEP-18557 */
    else if (typeof changeInfo != "undefined") {
        if (typeof tab.url != "undefined") {
            if (tab.url.indexOf("file:///") != -1) {
                tabToUrl[tabId] = tab.url;
                SendUrl(tab.url, "0"); // the tab just changed url
            }
        }
    }
});

function processCurrentTab(currentTabId) {
    if (tabToUrl[currentTabId] != null && !isURLWhitelisted(tabToUrl[currentTabId])) {
        SendUrl(tabToUrl[currentTabId], "1"); // switch back a tab
    }

    // for print blocking support
    let downloadEntity;
    if (tabToUrl[currentTabId] != undefined) {
        try {
            chrome.tabs.get(currentTabId, function (tab) {
                tabToUrl[currentTabId] = tab.url;
                if (tab.url.indexOf("file:///") != -1 && tab.url.indexOf(".pdf") != -1) {
                    downloadEntity = createDownload('PrintEvent', tab.url, tab.title);
                    downloadEntity.downloadFile();
                } else if (tab.url.indexOf("my.sharepoint.com") != -1) {
                    downloadEntity = createDownload('OneDriveForBusiness', tab.url, tab.title);
                    downloadEntity.downloadFile();
                } else if (tab.url.indexOf("sharepoint.com") != -1) {
                    downloadEntity = createDownload('Sharepoint', tab.url, tab.title);
                    downloadEntity.downloadFile();
                } else if (tab.url.indexOf(".live.com") != -1) {
                    downloadEntity = createDownload('OneDrive', tab.url, tab.title);
                    downloadEntity.downloadFile();
                } else if (tab.url.indexOf("docs.google") != -1) {
                    downloadEntity = createDownload('GoogleDrive', tab.url, '');
                    downloadEntity.downloadFile();
                }
            });
        }
        catch (error) {
            console.error(error);
        }
    }
}

chrome.tabs.onActivated.addListener(function (activeInfo) {
    if (chromeExtensionON == false)
        return { cancel: false };

    if (activeInfo != undefined) {
        processCurrentTab(activeInfo.tabId);
    }
});

// UEP-68820: when lose focus from an active tab with an online app in one browser window, a new tab
// in another browser window will cause removal online app from nep. Then switch back to the previous
// window with the online app still open, files can be sent without restrictions. Adding this event
// handler to force resending online url to nep to reactivate the protection.
chrome.windows.onFocusChanged.addListener(function () {
    if (chromeExtensionON == false)
        return { cancel: false };

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0] != undefined) {
            processCurrentTab(tabs[0].id);
        }
    });
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo)
{
    if (chromeExtensionON == false)
        return {cancel: false};

    if (tabToUrl[tabId] != null)
    {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0] != undefined && tabId == tabs[0].id) {
                //alert('2' + tabToUrl[tabId]);
                if(!isURLWhitelisted(tabToUrl[tabId]))
                    SendUrl(tabToUrl[tabId], "2"); // close a tab
                delete tabToUrl[tabId];
            }
        });
    }
});


chrome.windows.onRemoved.addListener(function(windowid)
{
 // print blocking temporary files clean up
 // since the browser window is getting closed, I assume that all temporary files need to be deleted
 // send action to DSE since there is no way to remove directory and its content using JavaScript

 SendUrl('file:///forcepoint.browser.window.closing', "3"); // the browser window is closing
 console.log("browser window closed");
});


//***********************************************************************************************************************
chromeExtServiceCheck();
//***********************************************************************************************************************
//New Gmail
var g_GmailBlockCount = 0;
var GMailUrl = "https://www.google.com/gmail";
chrome.webRequest.onErrorOccurred.addListener(
	function (details) {
		if((chromeExtensionON == true) && (typeof details != "undefined" && details))
		{
            if(details.method == "POST" && details.error == "net::ERR_BLOCKED_BY_CLIENT" && details.url.match(/mail\.google\.com\/sync/i) != null)
            {
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
					g_GmailBlockCount++;
					if(g_GmailBlockCount >= 3)
					{
						//chrome.tabs.reload(tabs[0].id);
						chrome.tabs.update(tabs[0].id, {url: GMailUrl});
						g_GmailBlockCount = 0;
					}

                    });
                }
            }
	},
	{urls: ["https://mail.google.com/*"]}
);
