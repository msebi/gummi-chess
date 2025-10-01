import { PrismaClient } from '../generated/prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function seedTestDb() {
    console.log('Seeding database...');

    const adminPassword = await hash('password-admin-444', 12);
    const userPassword = await hash('password-user-444', 12);

    const adminUser = await prisma.user.create({
        data: {
            email: 'admin@gmail.com',
            name: 'Admin',
            passwordHash: adminPassword, 
            isAdmin: true,
        },
    });

    const regularUser = await prisma.user.create({
        data: {
            email: 'freelance@sebastianmiga.de',
            name: 'User',
            passwordHash: userPassword,
            isAdmin: false,
        },
    });

    console.log('Created users:', { adminUser, regularUser });

    const tagOpening = await prisma.tag.create({ data : {name: 'Opening'} });
    const tagMiddleGame = await prisma.tag.create({ data: {name: 'Middlegame'} });
    const tagEndGame = await prisma.tag.create({ data: {name: 'Endgame'} });
    const tagFork = await prisma.tag.create({data : {name: 'Fork'} }); 
    const tagMate = await prisma.tag.create({data : {name: 'Checkmate'} });
    const tagSacrifice = await prisma.tag.create({data : {name: 'Sacrifice'} });
    const tagAttack = await prisma.tag.create({data : {name: 'Attack'} });
    const tagPuzzle = await prisma.tag.create({data: {name: 'Puzzle'}});
    const tagExchange = await prisma.tag.create({data: {name: 'Exchange'}});
    const tagTactics = await prisma.tag.create({data: {name: 'Tactics'}});
    const tagBlunder = await prisma.tag.create({data: {name: 'Blunder'}});
    const tagQueen = await prisma.tag.create({data: {name: 'Queen'}});
    const tagRook = await prisma.tag.create({data: {name: 'Rook'}});

    console.log('Created tags:', { tagOpening, tagMiddleGame, tagEndGame, tagFork, 
        tagMate, tagSacrifice, tagAttack, tagPuzzle, tagExchange, tagTactics, tagBlunder, tagQueen, tagRook });

    const course1 = await prisma.course.create({
        data: {
            title: 'Basic Chess Openings',
            description: 'Learn the fundamentals of chess openings.', 
            price: 0.00, 
            isFree: true,
            videoUrl: 'https://www.youtube.com/watch?v=AajKsTTNLOI',
            thumbnailUrl: 'https://img.youtube.com/vi/AajKsTTNLOI/hqdefault.jpg',
            tags: {
                create: [
                    { tag: { connect: { id: tagOpening.id } } },
                    { tag: { connect: { id: tagMiddleGame.id } } },
                ]
            },
        keyPositions: {
                create: [
                    { fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', description: 'Starting Position' },
                    { fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', description: 'Sicilian Defense' },
                    { fen: 'r1bqkbnr/pp1ppppp/2n5/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', description: 'After Nf3' },
                ]
            }
        },
    });

    const course2 = await prisma.course.create({
        data: {
            title: 'Sacrifice Tactics',
            description: 'Learn the fundamentals of sacrifice tactics in chess.',
            price: 0.00,
            isFree: true,
            videoUrl: 'https://www.youtube.com/watch?v=IiemCwyahAg',
            thumbnailUrl: 'https://img.youtube.com/vi/IiemCwyahAg/hqdefault.jpg',
            tags: {
                create: [
                    { tag: { connect: { id: tagSacrifice.id } } },
                    { tag: { connect: { id: tagMiddleGame.id } } },
                ]
            },
        keyPositions: {
                create: [
                    { fen: 'r1bqkbnr/p2ppppp/1pn5/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 0 5', description: 'A common middlegame' },
                    { fen: '4k3/8/8/8/8/8/4P3/4K3 w - - 0 1', description: 'King and Pawn Endgame' },
                ]
            }
        },
    });

    const course3 = await prisma.course.create({
        data: {
            title: 'Attacking Tactics',
            description: 'Learn the fundamentals of attacking tactics in chess.',
            price: 0.00,
            isFree: true,
            videoUrl: 'https://www.youtube.com/watch?v=emE6HuC90Fg',
            thumbnailUrl: 'https://img.youtube.com/vi/emE6HuC90Fg/hqdefault.jpg',
            tags: {
                create: [
                    { tag: { connect: { id: tagSacrifice.id } } },
                    { tag: { connect: { id: tagMiddleGame.id } } },
                ]
            },
            keyPositions: {
                create: [
                    { fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', description: 'Starting Position' },
                    { fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', description: 'Sicilian Defense' },
                    { fen: 'r1bqkbnr/pp1ppppp/2n5/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', description: 'After Nf3' },
                ]
            }
        },
    });

    const course4 = await prisma.course.create({
        data: {
            title: 'Chess Puzzle',
            description: 'An Amazing Masterpiece Composed By Alexey Troitsky.',
            price: 0.00,
            isFree: true,
            videoUrl: 'https://www.youtube.com/watch?v=Mkme4K83CO0',
            thumbnailUrl: 'https://img.youtube.com/vi/Mkme4K83CO0/hqdefault.jpg',
            tags: {
                create: [
                    { tag: { connect: { id: tagPuzzle.id } } },                    
                ]
            },
            keyPositions: {
                    create: [
                        { fen: 'r1bqkbnr/p2ppppp/1pn5/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 0 5', description: 'A common middlegame' },
                        { fen: '4k3/8/8/8/8/8/4P3/4K3 w - - 0 1', description: 'King and Pawn Endgame' },
                    ]
            }            
        },
    });

    const course5 = await prisma.course.create({
        data: {
            title: 'Chess Puzzle',
            description: 'A Fairy Chess Problem With Countless Bishops.',
            price: 0.00,
            isFree: true,
            videoUrl: 'https://www.youtube.com/watch?v=2n_FkxhSyYg',
            thumbnailUrl: 'https://img.youtube.com/vi/2n_FkxhSyYg/hqdefault.jpg',
            tags: {
                create: [
                    { tag: { connect: { id: tagPuzzle.id } } },                    
                ]
            },
            keyPositions: {
                create: [
                    { fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', description: 'Starting Position' },
                    { fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', description: 'Sicilian Defense' },
                    { fen: 'r1bqkbnr/pp1ppppp/2n5/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', description: 'After Nf3' },
                ]
            }            
        },
    });

    const course6 = await prisma.course.create({
        data: {
            title: 'Sacrifice',
            description: 'Queen Sacrifice.',
            price: 0.00,
            isFree: true,
            videoUrl: 'https://www.youtube.com/watch?v=Mkme4K83CO0',
            thumbnailUrl: 'https://img.youtube.com/vi/Mkme4K83CO0/hqdefault.jpg',
            tags: {
                create: [
                    { tag: { connect: { id: tagSacrifice.id } } },                    
                    { tag: { connect: { id: tagMiddleGame.id } } },                    
                ]
            },
            keyPositions: {
                create: [
                    { fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', description: 'Starting Position' },
                    { fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', description: 'Sicilian Defense' },
                    { fen: 'r1bqkbnr/pp1ppppp/2n5/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', description: 'After Nf3' },
                ]
            }            
        },
    });

    const course7 = await prisma.course.create({
        data: {
            title: 'Sacrifice',
            description: 'Queen Sacrifice.',
            price: 0.00,
            isFree: true,
            videoUrl: 'https://www.youtube.com/watch?v=Mkme4K83CO0',
            thumbnailUrl: 'https://img.youtube.com/vi/Mkme4K83CO0/hqdefault.jpg',
            tags: {
                create: [
                    { tag: { connect: { id: tagSacrifice.id } } },                    
                    { tag: { connect: { id: tagMiddleGame.id } } },                    
                ]
            },
            keyPositions: {
                    create: [
                        { fen: 'r1bqkbnr/p2ppppp/1pn5/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 0 5', description: 'A common middlegame' },
                        { fen: '4k3/8/8/8/8/8/4P3/4K3 w - - 0 1', description: 'King and Pawn Endgame' },
                    ]
            }  
        },
    });

    const course8 = await prisma.course.create({
        data: {
            title: 'Exchange Sacrifice in Chess',
            description: 'Magnus\' Exchange Sacrifice.',
            price: 0.00,
            isFree: true,
            videoUrl: 'https://www.youtube.com/watch?v=NcyEt0j7rlg',
            thumbnailUrl: 'https://img.youtube.com/vi/NcyEt0j7rlg/hqdefault.jpg',
            tags: {
                create: [
                    { tag: { connect: { id: tagSacrifice.id } } },                    
                    { tag: { connect: { id: tagExchange.id } } },                    
                ]
            },
            keyPositions: {
                    create: [
                        { fen: 'r1bqkbnr/p2ppppp/1pn5/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 0 5', description: 'A common middlegame' },
                        { fen: '4k3/8/8/8/8/8/4P3/4K3 w - - 0 1', description: 'King and Pawn Endgame' },
                    ]
            }              
        },
    });
    
    const course9 = await prisma.course.create({
        data: {
            title: 'Smothered Mate',
            description: 'Saemisch Stuns with A Queen Sacrifice for Smothered Mate.',
            price: 0.00,
            isFree: true,
            videoUrl: 'https://www.youtube.com/watch?v=2qBdOswEfbE',
            thumbnailUrl: 'https://img.youtube.com/vi/2qBdOswEfbE/hqdefault.jpg',
            tags: {
                create: [
                    { tag: { connect: { id: tagSacrifice.id } } },                    
                    { tag: { connect: { id: tagMate.id } } },                    
                ]
            },
            keyPositions: {
                    create: [
                        { fen: 'r1bqkbnr/p2ppppp/1pn5/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 0 5', description: 'A common middlegame' },
                        { fen: '4k3/8/8/8/8/8/4P3/4K3 w - - 0 1', description: 'King and Pawn Endgame' },
                    ]
            }  
        },
    });
 
    const course10 = await prisma.course.create({
        data: {
            title: 'Queen Sacrifice',
            description: 'How to win in chess without a Queen? Here is the answer!.',
            price: 0.00,
            isFree: true,
            videoUrl: 'https://www.youtube.com/watch?v=_x87iHbIzCM',
            thumbnailUrl: 'https://img.youtube.com/vi/_x87iHbIzCM/hqdefault.jpg',
            tags: {
                create: [
                    { tag: { connect: { id: tagSacrifice.id } } },                    
                    { tag: { connect: { id: tagMate.id } } },                    
                ]
            },
            keyPositions: {
                create: [
                    { fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', description: 'Starting Position' },
                    { fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', description: 'Sicilian Defense' },
                    { fen: 'r1bqkbnr/pp1ppppp/2n5/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', description: 'After Nf3' },
                ]
            }             
        },
    });

    const course11 = await prisma.course.create({
        data: {
            title: 'Vidit vs Firouzja! The French GM Wins The Poisoned Pawn',
            description: 'Explosive game.',
            price: 19.99,
            videoUrl: 'https://www.youtube.com/watch?v=LYguWPAnBtw',
            thumbnailUrl: 'https://img.youtube.com/vi/LYguWPAnBtw/hqdefault.jpg',
            tags: {
                create: [
                    { tag: { connect: { id: tagTactics.id } } },                    
                    { tag: { connect: { id: tagMate.id } } },                    
                ]
            },
            keyPositions: {
                create: [
                    { fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', description: 'Starting Position' },
                    { fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', description: 'Sicilian Defense' },
                    { fen: 'r1bqkbnr/pp1ppppp/2n5/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', description: 'After Nf3' },
                ]
            }             
        },
    });

    const course12 = await prisma.course.create({
        data: {
            title: 'Viswanathan Anand\'s Most Famous Queen Sacrifice',
            description: 'Explosive game.',
            price: 19.99,
            videoUrl: 'https://www.youtube.com/watch?v=dR4HjjrnClQ',
            thumbnailUrl: 'https://img.youtube.com/vi/dR4HjjrnClQ/hqdefault.jpg',
            tags: {
                create: [
                    { tag: { connect: { id: tagTactics.id } } },                    
                    { tag: { connect: { id: tagSacrifice.id } } },                    
                ]
            },
            keyPositions: {
                create: [
                    { fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', description: 'Starting Position' },
                    { fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', description: 'Sicilian Defense' },
                    { fen: 'r1bqkbnr/pp1ppppp/2n5/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', description: 'After Nf3' },
                ]
            }             
        },
    });
    
    const course13 = await prisma.course.create({
        data: {
            title: 'Viswanathan Anand\'s Most Famous Queen Sacrifice',
            description: 'Explosive game.',
            price: 19.99,
            videoUrl: 'https://www.youtube.com/watch?v=dR4HjjrnClQ',
            thumbnailUrl: 'https://img.youtube.com/vi/dR4HjjrnClQ/hqdefault.jpg',
            tags: {
                create: [
                    { tag: { connect: { id: tagTactics.id } } },
                    { tag: { connect: { id: tagSacrifice.id } } },
                ]
            },
            keyPositions: {
                    create: [
                        { fen: 'r1bqkbnr/p2ppppp/1pn5/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 0 5', description: 'A common middlegame' },
                        { fen: '4k3/8/8/8/8/8/4P3/4K3 w - - 0 1', description: 'King and Pawn Endgame' },
                    ]
            }              
        },
    });

    const course14 = await prisma.course.create({
        data: {
            title: 'Indian GM plays a fantastic attacking game!',
            description: 'Great game.',
            price: 19.99,
            videoUrl: 'https://www.youtube.com/watch?v=emE6HuC90Fg',
            thumbnailUrl: 'https://img.youtube.com/vi/emE6HuC90Fg/hqdefault.jpg',
            tags: {
                create: [
                    { tag: { connect: { id: tagAttack.id } } },
                    { tag: { connect: { id: tagMiddleGame.id } } },
                ]
            },
            keyPositions: {
                    create: [
                        { fen: 'r1bqkbnr/p2ppppp/1pn5/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 0 5', description: 'A common middlegame' },
                        { fen: '4k3/8/8/8/8/8/4P3/4K3 w - - 0 1', description: 'King and Pawn Endgame' },
                    ]
            }              
        },
    });    
    
    const course15 = await prisma.course.create({
        data: {
            title: 'A terrible Start for Magnus Carlsen At 2024 FIDE World Rapid Tournament',
            description: 'Great game.',
            price: 19.99,
            videoUrl: 'https://www.youtube.com/watch?v=NcyEt0j7rlg',
            thumbnailUrl: 'https://img.youtube.com/vi/NcyEt0j7rlg/hqdefault.jpg',
            tags: {
                create: [
                    { tag: { connect: { id: tagBlunder.id } } },
                    { tag: { connect: { id: tagMiddleGame.id } } },
                ]
            },
            keyPositions: {
                    create: [
                        { fen: 'r1bqkbnr/p2ppppp/1pn5/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 0 5', description: 'A common middlegame' },
                        { fen: '4k3/8/8/8/8/8/4P3/4K3 w - - 0 1', description: 'King and Pawn Endgame' },
                    ]
            }              
        },
    }); 

    const course16 = await prisma.course.create({
        data: {
            title: 'Saemisch Stuns with A Queen Sacrifice for Smothered Mate',
            description: 'Great game.',
            price: 19.99,
            videoUrl: 'https://www.youtube.com/watch?v=2qBdOswEfbE',
            thumbnailUrl: 'https://img.youtube.com/vi/2qBdOswEfbE/hqdefault.jpg',
            tags: {
                create: [
                    { tag: { connect: { id: tagSacrifice.id } } },
                    { tag: { connect: { id: tagMate.id } } },
                ]
            },
            keyPositions: {
                create: [
                    { fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', description: 'Starting Position' },
                    { fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', description: 'Sicilian Defense' },
                    { fen: 'r1bqkbnr/pp1ppppp/2n5/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', description: 'After Nf3' },
                ]
            }              
        },
    }); 

    const course17 = await prisma.course.create({
        data: {
            title: 'Judit Polgar\'s Most Brutal Attack Ever',
            description: 'Great game.',
            price: 19.99,
            videoUrl: 'https://www.youtube.com/watch?v=UsZ0q2ecnfo',
            thumbnailUrl: 'https://img.youtube.com/vi/UsZ0q2ecnfo/hqdefault.jpg',
            tags: {
                create: [
                    { tag: { connect: { id: tagAttack.id } } },                    
                ]
            },
            keyPositions: {
                create: [
                    { fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', description: 'Starting Position' },
                    { fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', description: 'Sicilian Defense' },
                    { fen: 'r1bqkbnr/pp1ppppp/2n5/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', description: 'After Nf3' },
                ]
            }              
        },
    }); 

    const course18 = await prisma.course.create({
        data: {
            title: 'Chess Puzzle: Staircase To Heaven',
            description: 'Puzzle.',
            price: 19.99,
            videoUrl: 'https://www.youtube.com/watch?v=UsZ0q2ecnfo',
            thumbnailUrl: 'https://img.youtube.com/vi/UsZ0q2ecnfo/hqdefault.jpg',
            tags: {
                create: [
                    { tag: { connect: { id: tagPuzzle.id } } },                    
                ]
            },
            keyPositions: {
                create: [
                    { fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', description: 'Starting Position' },
                    { fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', description: 'Sicilian Defense' },
                    { fen: 'r1bqkbnr/pp1ppppp/2n5/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', description: 'After Nf3' },
                ]
            }              
        },
    }); 

    const course19 = await prisma.course.create({
        data: {
            title: 'Attack At Any Price! This Is Why We Call Mikhail Tal A "Magician"',
            description: 'Best attacking game ever.',
            price: 19.99,
            videoUrl: 'https://www.youtube.com/watch?v=2ovQZG9ivL8',
            thumbnailUrl: 'https://img.youtube.com/vi/2ovQZG9ivL8/hqdefault.jpg',
            tags: {
                create: [
                    { tag: { connect: { id: tagAttack.id } } },      
                    { tag: { connect: { id: tagMiddleGame.id } } },
                    { tag: { connect: { id: tagSacrifice.id } } },
                ]
            },
            keyPositions: {
                    create: [
                        { fen: 'r1bqkbnr/p2ppppp/1pn5/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 0 5', description: 'A common middlegame' },
                        { fen: '4k3/8/8/8/8/8/4P3/4K3 w - - 0 1', description: 'King and Pawn Endgame' },
                    ]
            }             
        },
    }); 

    console.log('Seeding finished.');
};

seedTestDb()
.catch(async (e) => {
    console.error(e);
    await prisma.$disconnect(); 
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
})