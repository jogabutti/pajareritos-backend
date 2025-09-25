const birdSound = require('./bird-sound');

describe('Bird Sound Functionality', () => {
    it('should return the correct sound for a sparrow', () => {
        expect(birdSound('sparrow')).toBe('chirp');
    });

    it('should return the correct sound for a crow', () => {
        expect(birdSound('crow')).toBe('caw');
    });

    it('should return undefined for an unknown bird', () => {
        expect(birdSound('unknown')).toBeUndefined();
    });
});