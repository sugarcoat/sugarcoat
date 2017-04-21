var fs = require( 'fs' );
var path = require( 'path' );
var mkdirp = require( 'mkdirp' );

module.exports = {
    readFile: function ( file ) {
        return new Promise( ( resolve, reject ) => {

            fs.readFile( file, 'utf8', ( err, data ) => {

                if ( err ) return reject( err );

                return resolve( data );
            });
        });
    },
    writeFile: function ( file, contents ) {

        return new Promise( ( resolve, reject ) => {

            this.makeDirs( file )
            .then( function () {

                fs.writeFile( file, contents, ( err ) => {

                    if ( err ) return reject( err );

                    return resolve( file );
                });
            });
        });
    },
    makeDirs: function ( toPath ) {

        return new Promise( ( resolve, reject ) => {

            mkdirp( path.parse( toPath ).dir, ( err ) => {

                if ( err ) return reject( err );

                resolve();
            });
        });
    },
    copy: function ( fromPath, toPath ) {

        return new Promise( ( resolve, reject ) => {

            this.makeDirs( toPath )
            .then( function () {

                var reader = fs.createReadStream( fromPath )
                    , writer = fs.createWriteStream( toPath )
                    ;

                reader.on( 'error', reject );
                writer.on( 'error', reject );

                writer.on( 'finish', () => {

                    resolve( [ fromPath, toPath ] );
                });

                reader.pipe( writer );
            });
        });
    }
};