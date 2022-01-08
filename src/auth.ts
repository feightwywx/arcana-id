import { Buffer } from 'buffer';
const encode_base64 = (str: string) => Buffer.from(str, 'binary').toString('base64');
const apiUrl = 'https://acn.arcaea.icu/api/'

export interface AuthResponse {
  success: boolean,
  token: string,
  error_code: number
}

export interface ScoreType {
  song_id: string,
  difficulty: number,
  score: number,
  shiny_perfect_count: number,
  perfect_count: number,
  near_count: number,
  miss_count: number,
  time_played: number,
  rating: number
}

export interface UserBaseResponse {
  success: boolean,
  value?: {
    id: number,
    name: string,
    user_code: string,
    rating: number,
    recent_score?: ScoreType
  },
  error_code?: number
}

export interface ChangeInfoResponse {
  success: boolean,
  error_code?: number
}

export interface GetCloudSaveResponse {
  success: boolean,
  error_code?: number,
  save?: {
    device_model_name: string,
    created_at: number
  }
}

export interface UploadCloudSaveResponse {
  success: boolean,
  error_code?: number
}

export interface GetUserScoresResponse {
  success: boolean,
  error_code?: number
  value?: {
    b30: Array<ScoreType>
    r10: Array<ScoreType>,
    b30_rating: number,
    r10_rating: number,
    rating: number
  }
}

const arcanaAuthProvider = {
  isAuthenticated: false,
  signin(username: string, password: string, callback: Function) {
    let auth_data = encode_base64(username + ':' + password)
    let form = new FormData()
    form.set('auth_data', auth_data)

    let authResp = {
      success: false,
      token: '',
      error_code: 0
    } as AuthResponse

    fetch(apiUrl + 'get_token', {
      method: 'POST',
      body: form,
    }).then(
      response => {
        return response.ok ? response.json() : Promise.reject(-response.status)
      }
    ).then(
      jsonResponse => {
        if (jsonResponse) {
          authResp.success = (jsonResponse['success'] === true) ? true : false
          if (authResp.success) {
            authResp.token = jsonResponse['token'];
            arcanaAuthProvider.isAuthenticated = true;
          } else {
            authResp.error_code = jsonResponse['error_code'];
          }
        }
        callback(arcanaAuthProvider.isAuthenticated, authResp)
      }
    ).catch(
      err => {
        callback(false, err)
      }
    )
  },
  signout(callback: VoidFunction) {
    arcanaAuthProvider.isAuthenticated = false;
    setTimeout(callback, 100);
  }
};

export function getIdByUsername(username: string, callback: Function) {
  fetch(apiUrl + 'get_id_by_username/' + username, {
    method: 'GET',
  }).then(
    response => response.json()
  ).then(
    jsonResponse => {
      if (jsonResponse['success'] === true) {
        callback(jsonResponse['value']);
      }
    }
  );
}

export function getUserBase(id: string, callback: Function) {
  fetch(apiUrl + 'get_user_base/' + id, {
    method: 'GET',
  }).then(
    response => {
      return response.ok ? response.json() : Promise.reject(-response.status)
    }
  ).then(
    jsonResp => {
      if (jsonResp['success'] === true) {
        let recent_score = jsonResp['value']['recent_score'] ? JSON.parse(jsonResp['value']['recent_score']) : null;
        let userbase: UserBaseResponse = {
          success: jsonResp['success'],
          value: {
            id: jsonResp['value']['id'],
            name: jsonResp['value']['name'],
            user_code: jsonResp['value']['user_code'],
            rating: jsonResp['value']['rating'],
          }
        }
        if (userbase.value && recent_score) {
          userbase.value.recent_score = recent_score;
        }
        callback(userbase);
      } else {
        throw new Error(jsonResp['error_code'])
      }
    }
  ).catch(
    err => {
      let err_userbase = {
        success: false,
        error_code: err
      }
      callback(err_userbase);
    }
  );
}

export function doChangeUserInfo(
  token: string, old_username: string, new_username: string, old_password: string,
  new_password: string, callback: Function
) {
  let auth_data = encode_base64(old_username + ':' + old_password);
  let new_auth_data = encode_base64(new_username + ':' + new_password);
  let form = new FormData();
  form.set('token', token);
  form.set('auth_data', auth_data);
  form.set('new_auth_data', new_auth_data);

  let changeResp = {
    success: false
  } as ChangeInfoResponse

  fetch(apiUrl + 'change', {
    method: 'POST',
    body: form,
  }).then(
    response => {
      return response.ok ? response.json() : Promise.reject(-response.status)
    }
  ).then(
    jsonResp => {
      if (jsonResp['success'] === true) {
        changeResp.success = true;
        callback(changeResp)
      } else {
        throw new Error(jsonResp['error_code'])
      }
    }
  ).catch(
    err => {
      changeResp.error_code = err;
      callback(changeResp);
    }
  );
}

export function getCloudSave(token: string, callback: Function) {
  let form = new FormData();
  form.set('token', token);

  let cloudSaveResp = {
    success: false
  } as GetCloudSaveResponse;

  fetch(apiUrl + 'get_save', {
    method: 'POST',
    body: form,
  }).then(
    response => {
      return response.ok ? response.json() : Promise.reject(-response.status)
    }
  ).then(
    jsonResp => {
      if (jsonResp['success'] === true) {
        cloudSaveResp.success = true;
        cloudSaveResp.save = {
          created_at: jsonResp['save']['createdAt'],
          device_model_name: jsonResp['save']['devicemodelname']['val']
        };
        callback(cloudSaveResp);
      } else {
        throw new Error(jsonResp['error_code']);
      }
    }
  ).catch(
    err => {
      cloudSaveResp.error_code = err;
      callback(cloudSaveResp);
    }
  );
}

export function uploadCloudSave(token: string, callback: Function) {
  let form = new FormData();
  form.set('token', token);

  let uploadResp = {
    success: false
  } as UploadCloudSaveResponse;

  fetch(apiUrl + 'do_save', {
    method: 'POST',
    body: form,
  }).then(
    response => {
      return response.ok ? response.json() : Promise.reject(-response.status)
    }
  ).then(
    jsonResp => {
      if (jsonResp['success'] === true) {
        uploadResp.success = true;
        callback(uploadResp)
      } else {
        throw new Error(jsonResp['error_code'])
      }
    }
  ).catch(
    err => {
      uploadResp.error_code = err;
      callback(uploadResp);
    }
  );
}

export function getUserScores(id: string, callback: Function) {
  let scoreResp = {
    success: false
  } as GetUserScoresResponse

  fetch(apiUrl + 'get_scores/' + id, {
    method: 'GET',
  }).then(
    response => {
      return response.ok ? response.json() : Promise.reject(-response.status)
    }
  ).then(
    jsonResp => {
      if (jsonResp['success'] === true) {
        scoreResp.success = true;
        let b30 = [] as Array<ScoreType>
        let r10 = [] as Array<ScoreType>
        for (let i in jsonResp['value']['b30']) {
          let json_score = jsonResp['value']['b30'][i];
          let obj_score = {
            song_id: json_score['song_id'],
            difficulty: json_score['difficulty'],
            score: json_score['score'],
            shiny_perfect_count: json_score['shiny_perfect_count'],
            perfect_count: json_score['perfect_count'],
            near_count: json_score['near_count'],
            miss_count: json_score['miss_count'],
            time_played: json_score['date'],
            rating: json_score['rating']
          } as ScoreType;
          b30.push(obj_score)
        }
        for (let i in jsonResp['value']['r10']) {
          let json_score = jsonResp['value']['r10'][i];
          let obj_score = {
            song_id: json_score['song_id'],
            difficulty: json_score['difficulty'],
            score: json_score['score'],
            shiny_perfect_count: json_score['shiny_perfect_count'],
            perfect_count: json_score['perfect_count'],
            near_count: json_score['near_count'],
            miss_count: json_score['miss_count'],
            time_played: json_score['date'],
            rating: json_score['rating']
          } as ScoreType;
          r10.push(obj_score)
        }
        scoreResp.value = {
          b30: b30,
          r10: r10,
          b30_rating: jsonResp['value']['b30_rating'],
          r10_rating: jsonResp['value']['r10_rating'],
          rating: jsonResp['value']['rating']
        };
        callback(scoreResp);
      } else {
        throw new Error(jsonResp['error_code'])
      }
    }
  ).catch(
    err => {
      let err_userbase = {
        success: false,
        error_code: err
      };
      callback(err_userbase);
    }
  );
}

export { arcanaAuthProvider };
