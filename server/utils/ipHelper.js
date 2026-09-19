const isPrivateIp = (ip) => {
    if (!ip) return true;
    
    // Normalize IPv6 mapped IPv4 address (e.g. ::ffff:127.0.0.1 -> 127.0.0.1)
    let cleanIp = ip;
    if (ip.startsWith('::ffff:')) {
        cleanIp = ip.substring(7);
    }
    
    if (cleanIp === '::1' || cleanIp === 'localhost') return true;
    
    // Check IPv4 private ranges
    const ipv4Parts = cleanIp.split('.');
    if (ipv4Parts.length === 4) {
        const first = parseInt(ipv4Parts[0], 10);
        const second = parseInt(ipv4Parts[1], 10);
        
        if (first === 127) return true; // localhost
        if (first === 10) return true;  // 10.0.0.0/8
        if (first === 192 && second === 168) return true; // 192.168.0.0/16
        if (first === 172 && second >= 16 && second <= 31) return true; // 172.16.0.0/12
        if (first === 169 && second === 254) return true; // link-local
    }
    
    // Check IPv6 private/local ranges (e.g., unique local fc00::/7, link-local fe80::/10)
    if (cleanIp.startsWith('fe80:') || cleanIp.startsWith('fc00:') || cleanIp.startsWith('fd00:')) {
        return true;
    }
    
    return false;
};

const getClientIp = (req) => {
    let ip = req.ip || req.connection.remoteAddress;
    
    // If it's a private IP and there's x-forwarded-for header, try to extract client's real public IP
    if (isPrivateIp(ip) && req.headers['x-forwarded-for']) {
        const forwardedIps = req.headers['x-forwarded-for'].split(',');
        const clientIp = forwardedIps[0].trim();
        if (!isPrivateIp(clientIp)) {
            ip = clientIp;
        }
    }
    
    return ip;
};

module.exports = {
    isPrivateIp,
    getClientIp
};
