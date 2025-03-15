window.UmaV5Calculator = class UmaV5Calculator {
    constructor() {
        this.v5main_ept = 0;
        this.v5fold_ept = 0;
        this.v5sp_ept = 0;
        this.times = 1;

        // ��������
        this.is_dominant_lead = false;
        this.length = 0;
        this.cardname_static = '';
        this.present_friendship_point = 0;
        this.present_ground = -1;
        this.v5click = { ground: [0, 0, 0, 0, 0] };
    }

    calculate(params) {
        const card_vector = new Array(6).fill(null).map(() => ({
            type_static: 0,
            friendship_static: 0,
            friendship_award: 0,
            enthusiasm_award: 0,
            training_award: 0,
            strike_point: 0,
            friendship_point: 0,
            speed_bonus: 0,
            stamina_bonus: 0,
            power_bonus: 0,
            willpower_bonus: 0,
            wit_bonus: 0,
            sp_bonus: 0,
            present_ground: -1,
            present_friendship_point: 0
        }));

        // ����֧Ԯ������
        if (this.is_dominant_lead) {
            if (this.length < 3) {
                // 0,0,2,2,4,4
                card_vector[0].type_static = card_vector[1].type_static = 0;
                card_vector[2].type_static = card_vector[3].type_static = 2;
                card_vector[4].type_static = card_vector[5].type_static = 4;
            } else {
                // 0,0,1,1,2,4
                card_vector[0].type_static = card_vector[1].type_static = 0;
                card_vector[2].type_static = card_vector[3].type_static = 1;
                card_vector[4].type_static = 2;
                card_vector[5].type_static = 4;
            }
        } else {
            if (this.length < 3) {
                // 0,0,2,2,3,4
                card_vector[0].type_static = card_vector[1].type_static = 0;
                card_vector[2].type_static = card_vector[3].type_static = 2;
                card_vector[4].type_static = 3;
                card_vector[5].type_static = 4;
            } else if (this.length === 4) {
                // 0,0,1,2,2,4
                card_vector[0].type_static = card_vector[1].type_static = 0;
                card_vector[2].type_static = 1;
                card_vector[3].type_static = card_vector[4].type_static = 2;
                card_vector[5].type_static = 4;
            } else {
                // 0,0,1,1,2,4
                card_vector[0].type_static = card_vector[1].type_static = 0;
                card_vector[2].type_static = card_vector[3].type_static = 1;
                card_vector[4].type_static = 2;
                card_vector[5].type_static = 4;
            }
        }

        // ��������
        card_vector.forEach(card => {
            switch (card.type_static) {
                case 0:
                    Object.assign(card, {
                        friendship_award: 30,
                        enthusiasm_award: 0,
                        training_award: 10,
                        friendship_point: 35,
                        strike_point: 100,
                        speed_bonus: 3,
                        power_bonus: 2,
                        sp_bonus: 1
                    });
                    break;
                case 1:
                    Object.assign(card, {
                        friendship_award: 30,
                        enthusiasm_award: 30,
                        training_award: 10,
                        friendship_point: 30,
                        strike_point: 65,
                        stamina_bonus: 2,
                        willpower_bonus: 1,
                        sp_bonus: 1
                    });
                    break;
                case 2:
                    Object.assign(card, {
                        friendship_award: 30,
                        enthusiasm_award: 30,
                        training_award: 10,
                        friendship_point: 20,
                        strike_point: 65,
                        power_bonus: 3,
                        stamina_bonus: 1,
                        sp_bonus: 1
                    });
                    break;
                case 3:
                    Object.assign(card, {
                        friendship_award: 30,
                        enthusiasm_award: 0,
                        training_award: 0,
                        friendship_point: 20,
                        strike_point: 50,
                        speed_bonus: 1,
                        power_bonus: 2,
                        willpower_bonus: 1,
                        sp_bonus: 1
                    });
                    break;
                case 4:
                    Object.assign(card, {
                        friendship_award: 30,
                        enthusiasm_award: 50,
                        training_award: 20,
                        friendship_point: 25,
                        strike_point: 80,
                        wit_bonus: 1,
                        speed_bonus: 1,
                        sp_bonus: 2
                    });
                    break;
            }
        });

        // ����ҵ����Ը���
        const playerCard = card_vector.find(card => card.type_static === params.type_static);
        if (playerCard) {
            Object.assign(playerCard, params);
        }

        let remainingTimes = this.times;
        let v5main_ept = 0;
        let v5fold_ept = 0;
        let v5sp_ept = 0;

        while (remainingTimes > 0) {
            const result = this.simulateTraining(card_vector);
            
            // ��������
            if (v5main_ept !== 0) {
                v5main_ept = Math.floor((v5main_ept + result.mainValue) * 0.5);
            } else {
                v5main_ept = result.mainValue;
            }

            if (v5fold_ept !== 0) {
                v5fold_ept = Math.floor((v5fold_ept + result.foldValue) * 0.5 * 0.25);
            } else {
                v5fold_ept = Math.floor(result.foldValue * 0.25);
            }

            if (v5sp_ept !== 0) {
                v5sp_ept = Math.floor((v5sp_ept + result.spValue) * 0.5);
            } else {
                v5sp_ept = result.spValue;
            }

            remainingTimes--;
        }

        return {
            v5main_ept,
            v5fold_ept,
            v5sp_ept
        };
    }

    simulateTraining(cards) {
        const attributes = Array(6).fill(0);
        const grounds = Array(5).fill(null).map((_, index) => ({
            type: index,
            scale: 1,
            clickTimes: 0,
            tempClickTimes: 0,
            friendship_rate: 1,
            training_award: 0,
            enthusiasm_award: 0,
            member_award: 0,
            ground_bonus: 0,
            viceground_bonus: [0, 0, 0, 0, 0, 0],
            spground_bonus: 0,
            added: 0,
            viceadded: [0, 0, 0, 0, 0, 0],
            spadded: 0,
            score: 0
        }));

        let round = 0;
        let stage = 0;

        while (round < 73) {
            round++;

            // ����֧Ԯ������������
            cards.forEach((card, index) => {
                const strikeRate = (card.strike_point + 100) / (card.strike_point + 550);
                const unstrikeRate = 100 / (card.strike_point + 550);
                const roll = Math.random();
                
                if (roll < strikeRate) {
                    card.present_ground = card.type_static;
                } else if (roll < strikeRate + unstrikeRate * 4) {
                    do {
                        card.present_ground = Math.floor(Math.random() * 5);
                    } while (card.present_ground === card.type_static);
                } else {
                    card.present_ground = -1;
                }
            });

            // ���³���״̬
            this.updateGroundState(grounds, cards);

            // ����ÿ�����صĵ÷�
            this.calculateGroundScores(grounds, cards, stage);

            // ѡ����ѳ���
            const selectedGround = this.selectBestGround(grounds, cards);
            
            // ��������
            this.updateAttributes(attributes, grounds[selectedGround], cards);

            // ���½׶�
            if (round > 59) stage = 5;
            else if (round > 47) stage = 4;
            else if (round > 35) stage = 3;
            else if (round > 23) stage = 2;
            else if (round > 11) stage = 1;
        }

        return {
            mainValue: attributes[cards[0].type_static],
            foldValue: attributes.reduce((sum, val, index) => 
                index !== cards[0].type_static ? sum + val : sum, 0),
            spValue: attributes[5]
        };
    }

    updateGroundState(grounds, cards) {
        // ���ó���״̬
        grounds.forEach(ground => {
            ground.friendship_rate = 1;
            ground.training_award = 0;
            ground.enthusiasm_award = 0;
            ground.member_award = 0;
            ground.ground_bonus = 0;
            ground.viceground_bonus.fill(0);
            ground.spground_bonus = 0;
            ground.score = 0;
        });

        // ���³���״̬
        cards.forEach(card => {
            if (card.present_ground >= 0) {
                const ground = grounds[card.present_ground];
                ground.training_award += card.training_award;
                ground.enthusiasm_award += card.enthusiasm_award;
                ground.member_award += 1;

                if (card.present_friendship_point >= 80 && card.present_ground === card.type_static) {
                    ground.friendship_rate *= (card.friendship_award * 0.01 + 1) * (card.friendship_static * 0.01 + 1);
                }
            }
        });
    }

    calculateGroundScores(grounds, cards, stage) {
        // ��ʼ��maxAdded����
        let maxAdded = 0;

        // ȫ�ֹ��򣺵�֧Ԯ���� present_friendship_point С�� 80 ʱ�����ڳ��� score++
        cards.forEach(card => {
            if (card.present_friendship_point < 80 && card.present_ground >= 0) {
                grounds[card.present_ground].score++;
            }
        });

        // ���ݲ�ͬ�׶�Ӧ�ò�ͬ�����ֹ���
        switch (stage) {
            case 1: // stage == 1
                // 1. spadded >= 13ʱ���ó���score++
                grounds.forEach(ground => {
                    if (ground.spadded >= 13) {
                        ground.score++;
                    }
                });
                
                // 2. �������ض�����1��
                grounds[4].score++;
                
                // 3. added��ߵĳ��ػ�ö������
                maxAdded = Math.max(...grounds.map(g => g.added));
                grounds.forEach(ground => {
                    if (ground.added >= maxAdded * 0.8) { // �����ֵ������20%
                        ground.score++;
                    }
                });
                break;

            case 2: // stage == 2
                // 1. spadded >= 15ʱ���ó���score++
                grounds.forEach(ground => {
                    if (ground.spadded >= 15) {
                        ground.score++;
                    }
                });
                
                // 2. �������ض�����1��
                grounds[4].score++;
                
                // 3. added��ߵĳ��ػ�ö������
                maxAdded = Math.max(...grounds.map(g => g.added));
                grounds.forEach(ground => {
                    if (ground.added >= maxAdded * 0.85) { // �����ֵ������15%
                        ground.score++;
                    }
                });
                
                // 4. spadded > 25ʱ�����ʤ
                grounds.forEach(ground => {
                    if (ground.spadded > 25) {
                        ground.score = 100;
                    }
                });
                break;

            case 3: // stage == 3
                // 1. spadded >= 20ʱ���ó���score++
                grounds.forEach(ground => {
                    if (ground.spadded >= 20) {
                        ground.score++;
                    }
                });
                
                // 2. �������ض�����1��
                grounds[4].score++;
                
                // 3. added��ߵĳ��ػ�ö������
                maxAdded = Math.max(...grounds.map(g => g.added));
                grounds.forEach(ground => {
                    if (ground.added >= maxAdded * 0.9) { // �����ֵ������10%
                        ground.score++;
                    }
                });
                
                // 4. spadded > 35ʱ�����ʤ
                grounds.forEach(ground => {
                    if (ground.spadded > 35) {
                        ground.score = 100;
                    }
                });
                
                // 5. ����length��������ӷ�
                if (this.length < 2) {
                    // �������ض�����1��
                    grounds[2].score++;
                } else {
                    // �������ض�����1��
                    grounds[1].score++;
                }
                break;

            case 4: // stage == 4
                // 1. spadded >= 25ʱ���ó���score++
                grounds.forEach(ground => {
                    if (ground.spadded >= 25) {
                        ground.score++;
                    }
                });
                
                // 2. �������������ض�����1��
                grounds[4].score++;
                grounds[1].score++;
                
                // 3. added��ߵĳ��ػ�ö������
                maxAdded = Math.max(...grounds.map(g => g.added));
                grounds.forEach(ground => {
                    if (ground.added >= maxAdded * 0.95) { // �����ֵ������5%
                        ground.score++;
                    }
                });
                
                // 4. spadded > 45ʱ�����ʤ
                grounds.forEach(ground => {
                    if (ground.spadded > 45) {
                        ground.score = 100;
                    }
                });
                break;

            case 5: // stage == 5
                // 1. spadded >= 30ʱ���ó���score++
                grounds.forEach(ground => {
                    if (ground.spadded >= 30) {
                        ground.score++;
                    }
                });
                
                // 2. �������������طֱ��÷���
                grounds[4].score += 2;
                grounds[1].score++;
                
                // 3. added��ߵĳ��ػ�ö������
                maxAdded = Math.max(...grounds.map(g => g.added));
                grounds.forEach(ground => {
                    if (ground.added >= maxAdded) {
                        ground.score += 2;
                    }
                });
                
                // 4. spadded > 55ʱ�����ʤ
                grounds.forEach(ground => {
                    if (ground.spadded > 55) {
                        ground.score = 100;
                    }
                });
                break;
        }

        // ��ͬ������µ����ȼ��ж�
        const priorities = [0, 2, 4, 1, 3]; // �ٶ�>����>����>����>����
        grounds.forEach((ground, index) => {
            if (priorities.indexOf(index) >= 0) {
                ground.score += (5 - priorities.indexOf(index)) * 0.1;
            }
        });
    }

    selectBestGround(grounds, cards) {
        let bestScore = -1;
        let selectedGround = 0;

        grounds.forEach((ground, index) => {
            if (ground.score > bestScore) {
                bestScore = ground.score;
                selectedGround = index;
            }
        });

        return selectedGround;
    }

    updateAttributes(attributes, ground, cards) {
        // ����ѡ�г��ظ�������
        const basicBonus = 10 + ground.scale - 1;
        const viceBonus = 3 + ground.scale - 1;
        const spBonus = 2 + ground.scale - 1;

        attributes[ground.type] += ground.added;
        ground.viceadded.forEach((value, index) => {
            if (index < 5) attributes[index] += value;
        });
        attributes[5] += ground.spadded;

        // �����������
        cards.forEach(card => {
            if (card.present_ground === ground.type) {
                card.present_friendship_point += 5;
            }
        });

        // ���µ������
        this.v5click.ground[ground.type]++;
    }
};