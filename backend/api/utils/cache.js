class SimpleCache {
  constructor(ttlMinutes = 60) {
    this.cache = new Map();
    this.ttl = ttlMinutes * 60 * 1000; // Convert to milliseconds
  }

  set(key, value) {
    const expiresAt = Date.now() + this.ttl;
    this.cache.set(key, {
      value,
      expiresAt
    });
  }

  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  clear() {
    this.cache.clear();
  }

  size() {
    // Clean expired items first
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
    return this.cache.size;
  }
}

module.exports = SimpleCache;